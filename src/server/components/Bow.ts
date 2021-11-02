/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component } from "@flamework/components";
import { Essential } from "./Essential";
import { ToolAttributes, ToolInstance } from "./Tool";
import Config from "shared/Config";
import { CharacterLimb } from "shared/types";
import { Action } from "server/modules/Action";
import { Janitor } from "@rbxts/janitor";
import { playAnim } from "server/modules/AnimPlayer";
import { Events } from "server/events";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import PartCache from "@rbxts/partcache";

import { RunService, TweenService, Players } from "@rbxts/services";
import { PartCache as PartCacheType } from "@rbxts/partcache/out/class";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";

FastCast.VisualizeCasts = false;
const MAX_DIST = 200;

interface RangedInstance extends ToolInstance {
	BowAttach: BasePart;
	stringTOP: BasePart;
	stringBOTTOM: BasePart;
	stringMIDDLE: BasePart;
	Arrow: BasePart & {
		ArrowAttach: BasePart;
	};
}
const anims = Config.Animations.Bow;

export const [RangedHitMiddleWare, AddRangedHitMiddleware] = GenerateMiddleware<[Bow, Instance, BasePart, BasePart?]>();
export const [RangedDrawMiddleWare, AddRangedDrawMiddleware] = GenerateMiddleware<[Bow]>();
export const [RangedReleasedMiddleWare, AddRangedReleasedMiddleware] = GenerateMiddleware<[Bow]>();

@Component({
	tag: "Bow",
	defaults: {
		BUTTON_TOGGLE: "Two",
	},
})
export class Bow extends Essential<ToolAttributes, RangedInstance> {
	Ray = new Ray();
	AttachName = "BowAttach";
	Incompatible = ["Bow", "Shield", "RbxTool", "Sword", "Spear"];
	EnableAnimation = anims.Equip;
	DisableAnimation = anims.Holster;
	EnabledLimb = "LeftHand" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;
	ArrowMotor = new Instance("Motor6D");
	// @ts-ignore
	ActiveAnimation?: AnimationTrack;
	Time?: number;
	Moving = true;
	Caster: Caster = new FastCast();

	Arrow: BasePart & {
		ArrowAttach: BasePart;
	};
	Provider: PartCacheType<BasePart>;
	CastParams: RaycastParams;
	Behavior: FastCastBehavior;

	constructor() {
		super();
		this.Arrow = this.instance.Arrow;
		const Attachment0 = new Instance("Attachment");
		const Attachment1 = new Instance("Attachment");

		Attachment0.Position = new Vector3(0, -0.1, 0);
		Attachment1.Position = new Vector3(0, 0.1, 0);

		const Trail = new Instance("Trail");
		Trail.Attachment0 = Attachment0;
		Trail.Attachment1 = Attachment1;
		Trail.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.6),
			new NumberSequenceKeypoint(0.25, 0.7),
			new NumberSequenceKeypoint(0.5, 0.8),
			new NumberSequenceKeypoint(0.75, 0.9),
			new NumberSequenceKeypoint(1, 1),
		]);
		Trail.Lifetime = 1;

		const Factor = 100;
		Trail.MinLength = 0.1 * Factor;
		Trail.MaxLength = 10 * Factor;

		const NewArrow = this.Arrow.Clone();
		Attachment0.Parent = NewArrow;
		Attachment1.Parent = NewArrow;
		Trail.Parent = NewArrow;

		Trail.WidthScale = new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			new NumberSequenceKeypoint(0.25, 0.8),
			new NumberSequenceKeypoint(0.5, 0.6),
			new NumberSequenceKeypoint(0.75, 0.4),
			new NumberSequenceKeypoint(1, 0.2),
		]);

		Trail.Enabled = false;

		this.Provider = new PartCache(NewArrow, 10);

		const StoredArrows = new Instance("Folder");
		StoredArrows.Parent = this.instance;
		this.Provider.SetCacheParent(StoredArrows);

		this.CastParams = new RaycastParams();
		this.CastParams.FilterType = Enum.RaycastFilterType.Blacklist;

		this.Behavior = FastCast.newBehavior();
		this.Behavior.RaycastParams = this.CastParams;
		this.Behavior.CosmeticBulletProvider = this.Provider;
		this.Behavior.AutoIgnoreContainer = true;
		this.Behavior.Acceleration = new Vector3(0, -game.Workspace.Gravity / 2, 0);

		this.InputInfo.Enabled.Begin = {
			MouseButton1: {
				Action: "Draw",
				Mobile: {
					Position: UDim2.fromScale(0.6175, 0.2),
				},
			},
		};

		const Top = new Instance("Attachment");
		const Middle = new Instance("Attachment");
		const Bottom = new Instance("Attachment");

		Top.Parent = this.instance.stringTOP;
		Middle.Parent = this.instance.stringMIDDLE;
		Bottom.Parent = this.instance.stringBOTTOM;

		const RodTemplate = new Instance("RodConstraint");
		RodTemplate.Attachment0 = Middle;
		RodTemplate.Visible = true;
		RodTemplate.Thickness = 0.02;
		RodTemplate.Color = new BrickColor("White");

		const RodTop = RodTemplate.Clone();
		const RodBottom = RodTemplate.Clone();

		RodTop.Parent = this.instance.stringMIDDLE;
		RodBottom.Parent = this.instance.stringMIDDLE;
		RodTop.Attachment1 = Top;
		RodBottom.Attachment1 = Bottom;

		this.Caster.LengthChanged.Connect((cast, lastpoint, dir, displacement, segVel, arrow) => {
			if (!arrow?.IsA("BasePart")) {
				return;
			}

			const Trail = arrow.FindFirstChildWhichIsA("Trail");
			if (Trail && !Trail.Enabled) {
				Trail.Enabled = true;
			}

			arrow.CFrame = CFrame.lookAt(lastpoint.add(dir.mul(displacement)), lastpoint);
		});

		this.Behavior.CanPierceFunction = (cast, result) => {
			const hit = result.Instance;
			if (hit.Parent && hit.Parent.IsA("Accessory") && Players.GetPlayerFromCharacter(hit.Parent.Parent)) {
				return true;
			} else {
				return false;
			}
		};

		this.Caster.RayHit.Connect((caster, result, segmentVelocity, instance) => {
			if (!instance || !instance.IsA("BasePart")) {
				error("");
			}
			const hit = result.Instance;
			print(hit);

			const Player = Players.GetPlayerFromCharacter(hit.Parent);

			if (Player !== undefined) {
				if (Player === this.Player) {
					return;
				}

				RunMiddleware(RangedHitMiddleWare, this, Player, instance, hit);

				const Character = hit.Parent;
				if (!Character) {
					error();
				}
				const Humanoid = Character.FindFirstChildWhichIsA("Humanoid");
				if (!Humanoid) {
					error();
				}

				Humanoid.TakeDamage(30 * this.CalculateAccuracy());
			} else {
				RunMiddleware(RangedHitMiddleWare, this, hit, instance);
			}

			this.ArrowHit(result, instance);
		});

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
	}

	ArrowHit(result: RaycastResult, instance: BasePart) {
		if (!result.Instance.Anchored) {
			const Trail = instance.FindFirstChildWhichIsA("Trail");
			if (Trail) {
				Trail.Enabled = false;
			}

			return this.Provider.ReturnPart(instance);
		}

		task.spawn(() => {
			task.wait(10);
			if (instance && instance.IsDescendantOf(game)) {
				for (const v of instance.GetChildren()) {
					if (v.IsA("BasePart")) {
						TweenService.Create(v, new TweenInfo(0.5), {
							Transparency: 1,
						}).Play();
					}
				}
			}

			task.wait(0.5);
			this.Provider.ReturnPart(instance);
			for (const v of instance.GetChildren()) {
				if (v.IsA("BasePart") && v.Name !== "ArrowAttach") {
					v.Transparency = 0;
				}
				if (v.IsA("Trail")) {
					v.Enabled = false;
				}
			}
		});
	}

	GetMousePos(unitRay: Ray): Vector3 {
		const [ori, dir] = [unitRay.Origin, unitRay.Direction.mul(MAX_DIST)];
		const result = game.Workspace.Raycast(ori, dir, this.CastParams);
		return (result && result.Position) || ori.add(dir);
	}

	Draw(End: Callback, janitor: Janitor) {
		this.Time = tick();
		this.setState("Drawing");
		this.ToggleArrow("Enable");
		const [Player, Char] = this.GetCharPlayer();
		this.ActiveAnimation = playAnim(Char, anims.Shoot, { Fade: 0.4 });

		Events.ToggleRangedGUI(Player, true);

		janitor.Add(
			this.ActiveAnimation.GetMarkerReachedSignal("HoldShoot").Connect(() => {
				this.ActiveAnimation?.AdjustSpeed(0);
			}),
		);

		const Humanoid = Char.FindFirstChildWhichIsA("Humanoid");
		if (!Humanoid) {
			error("");
		}
		janitor.Add(
			RunService.Heartbeat.Connect(() => {
				if (Humanoid.MoveDirection !== new Vector3(0, 0, 0)) {
					this.Moving = true;
				} else {
					this.Moving = false;
				}
			}),
		);

		let run = true;
		janitor.Add(() => {
			run = false;
			Events.ToggleRangedGUI(Player, false);
		});
		task.spawn(() => {
			while (run) {
				Events.UpdateRangedGUI(Player, this.CalculateAccuracy());
				task.wait(0.2);
			}
		});

		task.spawn(() => {
			task.wait(0.9);
			if (run) {
				RunMiddleware(RangedDrawMiddleWare, this);
			}
		});
	}

	CalculateAccuracy() {
		if (this.Time === undefined) {
			error("requires this.time");
		}
		return ((this.Moving ? 0 : 1) + math.clamp((tick() - this.Time) / 2, 0, 1)) / 2;
	}

	Release(End: Callback, janitor: Janitor) {
		this.Actions.Draw.End();
		this.setState("Releasing");
		janitor.Add(() => {
			this.setState("Enabled");
		});
		this.ToggleArrow("Disable");

		if (this.ActiveAnimation === undefined || this.Time === undefined) {
			error("");
		}
		if (tick() - this.Time < 1) {
			this.ActiveAnimation.Stop(0.3);
			return End();
		}

		RunMiddleware(RangedReleasedMiddleWare, this);

		this.ActiveAnimation.TimePosition = 2;
		this.ActiveAnimation.AdjustSpeed(1);

		const pos = this.GetMousePos(this.Ray);
		const direction = pos.sub(this.instance.BowAttach.Position).Unit;

		this.Fire(direction);
		task.wait(this.ActiveAnimation.Length - this.ActiveAnimation.TimePosition);
		this.ActiveAnimation.Stop(0.4);
		print("DID STOP!");
		End();
	}

	Fire(direction: Vector3) {
		const directionCF = new CFrame(new Vector3(), direction);
		const spreadDirection = CFrame.fromOrientation(0, 0, math.random(0, math.pi * 2));
		const spreadAngle = CFrame.fromOrientation(math.rad(math.random(-8, 8)) * (1 - this.CalculateAccuracy()), 0, 0);
		const finalDirection = directionCF.mul(spreadDirection).mul(spreadAngle).LookVector;
		this.Caster.Fire(
			this.instance.BowAttach.Position,
			finalDirection,
			200 * this.CalculateAccuracy(),
			this.Behavior,
		);
	}

	playerInit(player: Player) {
		if (!this.ArrowMotor.IsDescendantOf(game)) {
			this.ArrowMotor = new Instance("Motor6D");
		}

		const Limb = this.GetLimb("RightHand");
		this.ArrowMotor.Part0 = Limb;
		this.ArrowMotor.Part1 = this.Arrow.ArrowAttach;
		this.ArrowMotor.Parent = Limb;
		this.ArrowMotor.Name = "Arrow" + this.id;
		this.ToggleArrow("Disable");

		const [Player, Char] = this.GetCharPlayer();
		this.Arrow.Parent = Char;

		this.janitor.Add(
			Events.MouseRay.connect((player, ray) => {
				if (player === this.Player) {
					this.Ray = ray;
				}
			}),
		);

		this.CastParams.FilterDescendantsInstances = [Char];
	}

	ToggleArrow(state: "Enable" | "Disable") {
		const Transparency = state === "Enable" ? 0 : 1;
		for (const instance of this.Arrow.GetDescendants()) {
			if (instance.Name === "ArrowAttach") {
				continue;
			}
			if (instance.IsA("BasePart")) {
				instance.Transparency = Transparency;
			}
		}
	}
}
