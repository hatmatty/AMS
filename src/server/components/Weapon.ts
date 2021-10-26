import RaycastHitbox, { HitboxObject } from "@rbxts/raycast-hitbox";
import { Essential } from "./Essential";
import { Component } from "@flamework/components";
import { ToolAttributes, ToolInstance } from "./Tool";
import Config from "shared/Config";
import { Action } from "server/modules/Action";
import { Events } from "server/events";
import { playAnim } from "server/modules/AnimPlayer";
import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";

const AttachmentName = "DmgPoint";

const [HitMiddleWare, AddHitMiddleware] = GenerateMiddleware<[Weapon, Instance, Map<Instance, boolean>]>();
const [DamageMiddleware, AddDamageMiddleware] = GenerateMiddleware<[Weapon, Player]>();
const [SwingMiddleware, AddSwingMiddleware] = GenerateMiddleware<[Weapon]>();
const [DrawMiddleware, AddDrawMiddleware] = GenerateMiddleware<[Weapon]>();

export { AddHitMiddleware, AddDamageMiddleware, AddSwingMiddleware, AddDrawMiddleware };

const ReleasePosition = 3;
const BaseDamage = 20;
const MaxDamage = 50;
const secToMax = 2;

export interface WeaponInstance extends ToolInstance {
	DmgPart: BasePart & {
		End: Attachment;
		Start: Attachment;
	};
}

print("RaycastHitbox:", RaycastHitbox);

@Component()
export abstract class Weapon extends Essential<ToolAttributes, WeaponInstance> {
	protected abstract GetAnimation(direction: "DOWN" | "LEFT" | "RIGHT"): number;

	Direction: "DOWN" | "LEFT" | "RIGHT" = "RIGHT";
	Damage = 0;
	Hitbox: HitboxObject = new RaycastHitbox(this.instance.DmgPart);

	StoredAnimations: {
		[index: string]: AnimationTrack;
	} = {};

	ActiveAnimation?: AnimationTrack;

	Init() {
		if (!Config.Elements.Direction) {
			return;
		}
	}

	PlayerInit() {
		const Params = new RaycastParams();
		const [Player, Character] = this.GetCharPlayer();

		Params.FilterDescendantsInstances = [Character, this.instance];
		Params.FilterType = Enum.RaycastFilterType.Blacklist;

		this.Hitbox.RaycastParams = Params;

		this.janitor.Add(
			Events.Direction.connect((player, direction) => {
				if (player === this.Player) {
					this.Direction = direction;
				}
			}),
		);

		this.Hitbox.DetectionMode = 3;
		this.Hitbox.Visualizer = true;
	}

	constructor() {
		super();

		this.InputInfo.Enabled.Begin = {
			MouseButton1: {
				Action: "Draw",
			},
		};

		this.InputInfo.Drawing = {
			End: {
				MouseButton1: {
					Action: "Release",
				},
			},
		};

		this.Actions.Draw = new Action((End, janitor) => this.Draw(End, janitor));
		this.Actions.Release = new Action((End, janitor) => this.Release(End, janitor));

		let Start = this.instance.DmgPart.Start;
		let End = this.instance.DmgPart.End;

		Start.Name = AttachmentName;
		End.Name = AttachmentName;

		if (Start.Position.Y > End.Position.Y) {
			[Start, End] = [End, Start];
		}

		const inc = 0.1;
		for (let i: number = Start.Position.Y + inc; i < End.Position.Y; i += inc) {
			const Attachment = new Instance("Attachment");
			Attachment.Position = new Vector3(0, i, 0);
			Attachment.Parent = this.instance.DmgPart;
			Attachment.Name = AttachmentName;
		}

		this.Hitbox.Destroy();
		this.Hitbox = new RaycastHitbox(this.instance.DmgPart);

		//this.Hitbox.LinkAttachments(Start, End);

		const Trail = new Instance("Trail");
		Trail.Parent = this.instance.DmgPart;
		Trail.Attachment0 = Start;
		Trail.Attachment1 = End;
		Trail.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.95),
			new NumberSequenceKeypoint(0.25, 0.965),
			new NumberSequenceKeypoint(0.5, 0.979),
			new NumberSequenceKeypoint(0.75, 0.985),
			new NumberSequenceKeypoint(1, 1),
		]);
		Trail.Lifetime = 0.2;
	}

	private Draw(End: Callback, janitor: Janitor) {
		this.setState("Drawing");

		this.ActiveAnimation = playAnim(this.Player, this.GetAnimation(this.Direction), { Fade: 0.1 });

		janitor.Add(
			this.ActiveAnimation.GetMarkerReachedSignal("DrawEnd").Connect(() => {
				this.ActiveAnimation?.AdjustSpeed(0);
			}),
		);

		this.Damage = BaseDamage;

		let IncreaseDamage = true;
		janitor.Add(() => {
			IncreaseDamage = false;
		});

		let timePassed = 0;
		const time = secToMax / 20;
		while (IncreaseDamage) {
			task.wait(time);
			timePassed += time;
			this.Damage = math.min(timePassed / secToMax, 1) * (MaxDamage - BaseDamage) + BaseDamage;
			if (timePassed >= secToMax) {
				IncreaseDamage = false;
			}
		}

		RunMiddleware(DrawMiddleware, this);
	}

	private Release(End: Callback, janitor: Janitor) {
		this.setState("Releasing");
		if (!this.Actions.Draw.Status || this.Actions.Draw.Status === "ENDED") {
			error("attempting to release sword when the sword hasn't drawn");
		}
		this.Actions.Draw.End();
		if (!this.ActiveAnimation) {
			error("Active Animation Required From Draw");
		}

		RunMiddleware(SwingMiddleware, this);

		this.ActiveAnimation.TimePosition = ReleasePosition;
		this.ActiveAnimation.AdjustSpeed(1);

		this.Hitbox.HitStart(this.ActiveAnimation.Length - ReleasePosition);
		const db = new Map<Instance, boolean>();
		this.Hitbox.OnHit.Connect((hit) => {
			if (db.get(hit)) {
				return;
			}
			db.set(hit, true);

			const Player = Players.GetPlayerFromCharacter(hit.Parent);
			if (Player !== undefined) {
				if (db.get(Player)) {
					return;
				}
				db.set(Player, true);

				if (Player === this.Player) {
					return;
				}

				RunMiddleware(HitMiddleWare, this, Player, db);

				const Character = hit.Parent;
				if (!Character) {
					error();
				}
				const Humanoid = Character.FindFirstChildWhichIsA("Humanoid");
				if (!Humanoid) {
					error();
				}

				RunMiddleware(DamageMiddleware, this, Player);

				Humanoid.TakeDamage(this.Damage);
			} else {
				RunMiddleware(HitMiddleWare, this, hit, db);
			}
		});

		// janitor.Add(this.Hitbox.OnHit.Connect((hit, humanoid) => {}));

		janitor.Add(() => {
			this.setState("Enabled");
			this.Hitbox.HitStop();
		});

		task.wait(this.ActiveAnimation.Length - ReleasePosition - 0.1);
		if (this.Actions.Release.Status === "ENDED") {
			return;
		}
		End();
	}
}
