import RaycastHitbox, { HitboxObject } from "@rbxts/raycast-hitbox";
import { Essential } from "./Essential";
import { Component } from "@flamework/components";
import { ToolAttributes, ToolInstance } from "./Tool";
import Config from "shared/Config";
import { Action } from "server/modules/Action";
import { Events } from "server/events";
import { playAnim } from "server/modules/AnimPlayer";
import { Janitor } from "@rbxts/janitor";
import { EndOfLineState, parseJsonText } from "typescript";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";

// type HitMiddleWare = (stop: Callback, tool: Weapon, hit: BasePart) => void;
// const HitMiddleWare: HitMiddleWare[] = [];

const [HitMiddleWare, AddHitMiddleware] = GenerateMiddleware<[Weapon, BasePart]>();
const [DamageMiddleware, AddDamageMiddleware] = GenerateMiddleware<[Weapon, Player]>();
const [SwingMiddleware, AddSwingMiddleware] = GenerateMiddleware<[Weapon]>();
const [DrawMiddleware, AddDrawMiddleware] = GenerateMiddleware<[Weapon]>();

export { AddHitMiddleware, AddDamageMiddleware, AddSwingMiddleware, AddDrawMiddleware };

const ReleasePosition = 5;
const BaseDamage = 20;
const MaxDamage = 50;
const secToMax = 2;

export interface WeaponInstance extends ToolInstance {
	DmgPart: BasePart & {
		End: Attachment;
		Start: Attachment;
	};
}

@Component()
export abstract class Weapon extends Essential<ToolAttributes, WeaponInstance> {
	protected abstract GetDirection(playerDirection: "UP" | "DOWN", Direction: string): string;
	protected abstract GetAnimation(direction: string): number;

	PlayerDirection: "UP" | "DOWN" = "DOWN";
	Direction = "@@INIT";
	Damage = 0;
	Hitbox = new RaycastHitbox(this.instance.DmgPart);

	StoredAnimations: {
		[index: string]: AnimationTrack;
	} = {};

	ActiveAnimation?: AnimationTrack;

	Init() {
		if (!Config.Elements.Direction) {
			return;
		}

		let Start = this.instance.DmgPart.Start;
		let End = this.instance.DmgPart.End;

		if (Start.Position.Y > End.Position.Y) {
			[Start, End] = [End, Start];
		}

		const Points: Vector3[] = [];
		for (let i = Start.Position.Y; i < End.Position.Y; i += 0.1) {
			Points.push(new Vector3(0, i, 0));
		}

		this.Hitbox.SetPoints(this.instance.DmgPart, Points);

		const Trail = new Instance("Trail");
		Trail.Parent = this.instance.DmgPart;
		Trail.Attachment0 = Start;
		Trail.Attachment1 = End;
		Trail.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.925),
			new NumberSequenceKeypoint(0.25, 0.95),
			new NumberSequenceKeypoint(0.5, 0.975),
			new NumberSequenceKeypoint(0.75, 0.985),
			new NumberSequenceKeypoint(1, 1),
		]);
		Trail.Lifetime = 0.2;
	}

	PlayerInit() {
		const Params = new RaycastParams();
		const Player = this.Player;
		if (!Player) {
			error();
		}
		const Character = Player.Character;
		if (!Character) {
			error();
		}

		Params.FilterDescendantsInstances = [Character, this.instance];
		Params.FilterType = Enum.RaycastFilterType.Blacklist;

		this.Hitbox.RaycastParams = Params;

		this.janitor.Add(
			Events.Direction.connect((player, direction) => {
				if (player === this.Player) {
					this.PlayerDirection = direction;
				}
			}),
		);

		this.Hitbox.DetectionMode = 2;
		this.Hitbox.Visualizer = false;
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
	}

	Draw(End: Callback, janitor: Janitor) {
		this.setState("Drawing");

		this.Direction = this.GetDirection(this.PlayerDirection, this.Direction);
		print(this.Direction, this.PlayerDirection);
		this.ActiveAnimation = playAnim(this.Player, this.GetAnimation(this.Direction));

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

	Release(End: Callback, janitor: Janitor) {
		this.setState("Releasing");
		if (!this.Actions.Draw.Status || this.Actions.Draw.Status === "ENDED") {
			error("attempting to release sword when the sword hasn't drawn");
		}
		this.Actions.Draw.End();
		if (!this.ActiveAnimation) {
			error("Active Animation Required From Draw");
		}

		this.ActiveAnimation.TimePosition = ReleasePosition;
		this.ActiveAnimation.AdjustSpeed(1);

		RunMiddleware(SwingMiddleware, this);

		this.Hitbox.HitStart(this.ActiveAnimation.Length - ReleasePosition - 0.05);
		const db = new Map<Instance, boolean>();
		this.Hitbox.OnHit.Connect((hit) => {
			if (db.get(hit)) {
				return;
			}
			db.set(hit, true);

			RunMiddleware(HitMiddleWare, this, hit);

			const Player = Players.GetPlayerFromCharacter(hit.Parent);
			if (Player !== undefined) {
				if (db.get(Player)) {
					return;
				}
				db.set(Player, true);

				const Character = hit.Parent;
				if (!Character) {
					error();
				}
				const Humanoid = Character.FindFirstChildWhichIsA("Humanoid");
				if (!Humanoid) {
					error();
				}

				print(Player, Character);
				RunMiddleware(DamageMiddleware, this, Player);

				Humanoid.TakeDamage(this.Damage);
			}
		});

		// janitor.Add(this.Hitbox.OnHit.Connect((hit, humanoid) => {}));

		janitor.Add(() => {
			this.setState("Enabled");
			this.Hitbox.HitStop();
		});

		task.wait(this.ActiveAnimation.Length - ReleasePosition - 0.05);
		End();
	}
}
