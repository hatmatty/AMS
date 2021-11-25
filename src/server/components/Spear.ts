import { Component } from "@flamework/components";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import { Janitor } from "@rbxts/janitor";
import { PureComponent } from "@rbxts/roact";
import { Action } from "server/modules/Action";
import { CreateWeld } from "server/modules/CreateWeld";
import {
	CreateBehaviorParams,
	DrawShoot,
	ManageRay,
	Ranged,
	ReleaseShot,
	SetupRanged,
} from "server/modules/RangedUtil";
import Config from "shared/Config";
import { CharacterLimb, Directions } from "shared/Types";
import { isJSDocSignature } from "typescript";
import { ToolAttributes, ToolInstance } from "./Tool";
import { Weapon } from "./Weapon";
import { Players } from "@rbxts/services";

const anims = Config.Animations.Spear;
const attackAnims = anims.Attack;
const blockAnims = anims.Block;

FastCast.VisualizeCasts = false;

import { WeaponInstance } from "./Weapon";

interface SpearInstance extends WeaponInstance {
	DmgPart: BasePart & {
		End: Attachment;
		Start: Attachment;
		RangedEnd: Attachment;
		RangedStart: Attachment;
	};
}

@Component({
	tag: "Spear",
	defaults: {
		BUTTON_TOGGLE: "One",
	},
})
export class Spear extends Weapon<SpearInstance> implements Ranged {
	className = "Spear" as const;
	Locked = false;
	AttachName = "SpearAttach";
	EnableAnimation = anims.Equip;
	DisableAnimation = anims.Holster;
	EnabledLimb = "RightHand" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;
	Prompt = new Instance("ProximityPrompt");
	AttackAnimations = {
		UP: attackAnims.Upper,
		DOWN: attackAnims.Lower,
		RIGHT: attackAnims.Right,
		LEFT: attackAnims.Left,
	};
	BlockAnimations = {
		UP: blockAnims.Up,
		DOWN: blockAnims.Down,
		RIGHT: blockAnims.Right,
		LEFT: blockAnims.Left,
	};
	WalkEffect = false;
	Fade = undefined;
	MinWaitTime = 1;
	AnimationShootPosition = 3;
	Velocity = 100;
	Gravity = new Vector3(0, -game.Workspace.Gravity / 3, 0);
	MaxDamage = 80;
	Caster: Caster = new FastCast();
	Ray = new Ray();
	MAX_DIST = 200;
	MaxTime = 2;
	NotMoving = 0;
	Time = tick();
	MainPart: BasePart;
	CastParams: RaycastParams;
	Behavior: FastCastBehavior;
	LockedJoint?: Weld;
	RangedTrail: Trail;

	constructor() {
		super();
		this.MainPart = this.BodyAttach;
		task.defer(() => {
			this.MainPart = this.BodyAttach;
		});
		this.InputInfo.Enabled.Begin.E = {
			Action: "StartThrow",
		};
		this.InputInfo.DrawingThrow = {
			End: {
				E: {
					Action: "EndThrow",
				},
			},
		};

		[this.Behavior, this.CastParams] = CreateBehaviorParams(this);

		this.Actions.StartThrow = new Action((End, janitor) => this.StartThrow(End, janitor));
		this.Actions.EndThrow = new Action((End, janitor) => this.EndThrow(End, janitor));

		this.Caster.LengthChanged.Connect((caster, lastpoint, dir, displacement, velocity, instance) => {
			this.BodyAttach.CFrame = CFrame.lookAt(lastpoint.add(dir.mul(displacement)), lastpoint).mul(
				CFrame.Angles(0, math.rad(90), 0).mul(CFrame.Angles(math.rad(90), 0, 0)),
			);
		});
		SetupRanged(this);

		this.Prompt.MaxActivationDistance = 4;
		task.defer(() => {
			this.Prompt.Parent = this.BodyAttach;
		});

		this.Prompt.ActionText = "Pickup";

		this.Prompt.Triggered.Connect((player) => {
			const Char = player.Character;
			if (Char && Char.IsA("Model")) {
				const Humanoid = Char.FindFirstChild("Humanoid");
				if (Humanoid && Humanoid.IsA("Humanoid") && Humanoid.Health > 0) {
					this.instance.Parent = Char;
				}
			}
		});

		this.Prompt.RequiresLineOfSight = false;
		const RangedTrail = new Instance("Trail");
		RangedTrail.Attachment0 = this.instance.DmgPart.RangedStart;
		RangedTrail.Attachment1 = this.instance.DmgPart.RangedEnd;
		RangedTrail.Enabled = false;
		RangedTrail.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.6),
			new NumberSequenceKeypoint(0.25, 0.7),
			new NumberSequenceKeypoint(0.5, 0.8),
			new NumberSequenceKeypoint(0.75, 0.9),
			new NumberSequenceKeypoint(1, 0.95),
		]);
		RangedTrail.Lifetime = 3;
		RangedTrail.Parent = this.instance.DmgPart;

		this.RangedTrail = RangedTrail;
	}

	RangedHit(result: RaycastResult) {
		this.LockedJoint = CreateWeld(this.BodyAttach, result.Instance);
		this.BodyAttach.Anchored = false;
		const Player = Players.GetPlayerFromCharacter(result.Instance.Parent);
		if (Player && result.Instance.Parent?.IsA("Model")) {
			const Char = result.Instance.Parent;
			const Humanoid = Char.FindFirstChildWhichIsA("Humanoid");
			if (!Humanoid) {
				error("could not get humanoid");
			}

			if (Humanoid.Health <= 0) {
				task.wait(1);
				this.BodyAttach.Anchored = true;
				this.BodyAttach.CanCollide = true;
				this.LockedJoint.Destroy();
				this.BodyAttach.Position = result.Instance.Position;
				this.LockedJoint = undefined;
			}

			this.janitor.Add(
				Humanoid.Died.Connect(() => {
					task.wait(1);
					this.BodyAttach.Anchored = true;
					this.BodyAttach.CanCollide = true;
					if (this.LockedJoint) {
						this.LockedJoint.Destroy();
					}
					this.BodyAttach.Position = result.Instance.Position;
					this.LockedJoint = undefined;
				}),
			);
		}
		this.Prompt.Enabled = true;
		this.RangedTrail.Enabled = false;
	}

	StartThrow(End: Callback, janitor: Janitor) {
		this.setState("DrawingThrow");
		DrawShoot(this, janitor, "DrawEnd", this.AttackAnimations.UP);
	}

	EndThrow(End: Callback, janitor: Janitor) {
		this.Actions.StartThrow.End();
		this.setState("Throwing");
		janitor.Add(() => {
			this.setState("Enabled");
		});

		if (ReleaseShot(this, End)) {
			this.BodyAttach.Anchored = true;
			this.RangedTrail.Enabled = true;
			this.instance.Parent = game.Workspace;
		}
	}

	WorkspaceInit = () => {};

	weaponPlayerInit() {
		ManageRay(this);
		if (this.LockedJoint) {
			this.Locked = false;
			this.LockedJoint.Destroy();
			this.LockedJoint = undefined;
		}
		this.Prompt.Enabled = false;
		this.BodyAttach.CanCollide = false;
		this.BodyAttach.Anchored = false;

		this.RangedTrail.Enabled = false;
	}

	Destroy() {}
}
