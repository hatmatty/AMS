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
import { Directions } from "shared/types";

const AttachmentName = "DmgPoint";

const [HitMiddleWare, AddHitMiddleware] = GenerateMiddleware<[Weapon, Instance, Map<Instance, boolean>]>();
const [DamageMiddleware, AddDamageMiddleware] = GenerateMiddleware<[Weapon, Player]>();
const [SwingMiddleware, AddSwingMiddleware] = GenerateMiddleware<[Weapon]>();
const [DrawMiddleware, AddDrawMiddleware] = GenerateMiddleware<[Weapon]>();

export { AddHitMiddleware, AddDamageMiddleware, AddSwingMiddleware, AddDrawMiddleware };

const ReleasePosition = 3;
const BaseDamage = 20;
const MaxDamage = 40;
const secToMax = 2;

export interface WeaponInstance extends ToolInstance {
	DmgPart: BasePart & {
		End: Attachment;
		Start: Attachment;
	};
}

@Component()
export abstract class Weapon<T extends WeaponInstance = WeaponInstance> extends Essential<ToolAttributes, T> {
	protected abstract AttackAnimations: {
		UP: number;
		DOWN: number;
		LEFT: number;
		RIGHT: number;
	};
	private timePassed = 0;
	protected abstract Fade?: number;
	protected abstract weaponPlayerInit(): void;
	protected Trail: Trail;
	protected TrailLifetime = 0.2;
	protected TrailTransparency = new NumberSequence([
		new NumberSequenceKeypoint(0, 0.9),
		new NumberSequenceKeypoint(0.25, 0.925),
		new NumberSequenceKeypoint(0.5, 0.95),
		new NumberSequenceKeypoint(0.75, 0.975),
		new NumberSequenceKeypoint(1, 1),
	]);
	Speed = 1.25;

	Incompatible = ["RbxTool", "Sword", "Bow", "Spear"];

	Direction: Directions = "RIGHT";
	Damage = 0;
	Hitbox: HitboxObject;

	StoredAnimations: {
		[index: string]: AnimationTrack;
	} = {};

	ActiveAnimation?: AnimationTrack;

	playerInit(player: Player) {
		this.weaponPlayerInit();
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
	}

	constructor() {
		super();

		this.InputInfo.Enabled.Begin = {
			MouseButton1: {
				Action: "Draw",
				Mobile: {
					Position: UDim2.fromScale(0.6175, 0.2),
				},
			},
		};

		this.InputInfo.Drawing = {
			End: {
				MouseButton1: {
					Action: "Release",
					Mobile: {
						Position: UDim2.fromScale(0.6175, 0.2),
					},
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

		const Trail = new Instance("Trail");
		this.Trail = Trail;
		Trail.Parent = this.instance.DmgPart;
		Trail.Attachment0 = Start;
		Trail.Attachment1 = End;
		Trail.Transparency = this.TrailTransparency;
		Trail.Lifetime = this.TrailLifetime;

		this.Hitbox = new RaycastHitbox(this.instance.DmgPart);
		this.Hitbox.DetectionMode = 2;
		this.Hitbox.Visualizer = true;
		Trail.Enabled = false;
	}

	private Draw(End: Callback, janitor: Janitor) {
		this.setState("Drawing");
		const [Player, Char] = this.GetCharPlayer();
		Char.SetAttribute("Swinging", true);
		this.setActiveAnimation(this.AttackAnimations[this.Direction], janitor);

		this.Damage = BaseDamage;

		let IncreaseDamage = true;
		janitor.Add(() => {
			IncreaseDamage = false;
		});

		let timePassed = 0;
		this.timePassed = timePassed;
		const time = secToMax / 20;
		while (IncreaseDamage) {
			task.wait(time);
			timePassed += time;
			this.Damage = math.min(timePassed / secToMax, 1) * (MaxDamage - BaseDamage) + BaseDamage;
			if (timePassed >= secToMax) {
				IncreaseDamage = false;
			}
			this.timePassed = timePassed;
		}

		RunMiddleware(DrawMiddleware, this);
	}

	protected SetAnchored(bool: boolean) {
		for (const instance of this.instance.GetDescendants()) {
			if (instance.IsA("BasePart")) {
				instance.Anchored = bool;
			}
		}
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

		if (this.timePassed < 0.25) {
			task.wait(0.25 - this.timePassed);
		}

		if (this.Actions.Release.Status === "ENDED") {
			return;
		}

		const [Player, Char] = this.GetCharPlayer();

		RunMiddleware(SwingMiddleware, this);

		this.ActiveAnimation.TimePosition = ReleasePosition;
		this.ActiveAnimation.AdjustSpeed(this.Speed);

		const RemainingLength = (this.ActiveAnimation.Length - ReleasePosition) * (1 / this.Speed);
		this.Hitbox.HitStart(RemainingLength);
		const db = new Map<Player, boolean>();
		this.Hitbox.OnHit.Connect((hit) => {
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

		janitor.Add(() => {
			Char.SetAttribute("Swinging", undefined);
			this.setState("Enabled");
			this.Hitbox.HitStop();
		});

		const HitStop = 0.2;
		task.wait(RemainingLength - HitStop);

		this.Hitbox.HitStop();

		task.wait(HitStop);
		// @ts-expect-error time is passing
		if (this.Actions.Release.Status === "ENDED") {
			return;
		}
		End();
	}

	protected setActiveAnimation(animation: number, janitor: Janitor) {
		this.ActiveAnimation = playAnim(this.Player, animation, {
			Fade: this.Fade !== undefined ? this.Fade : undefined || 0.1,
		});
		this.ActiveAnimation.Priority = Enum.AnimationPriority.Action;

		janitor.Add(
			this.ActiveAnimation.GetMarkerReachedSignal("DrawEnd").Connect(() => {
				this.ActiveAnimation?.AdjustSpeed(0);
			}),
		);
	}

	Destroy() {}
}
