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
FastCast.VisualizeCasts = false;

@Component({
	tag: "Spear",
	defaults: {
		BUTTON_TOGGLE: "One",
	},
})
export class Spear extends Weapon implements Ranged {
	Name = "Spear";
	Locked = false;
	AttachName = "SpearAttach";
	EnableAnimation = anims.Equip;
	DisableAnimation = anims.Holster;
	EnabledLimb = "RightHand" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;
	Prompt = new Instance("ProximityPrompt");
	AttackAnimations = {
		UP: anims.Upper,
		DOWN: anims.Lower,
		RIGHT: anims.Lower,
		LEFT: anims.Lower,
	};
	Fade = undefined;
	MinWaitTime = 1;
	AnimationShootPosition = 3;
	Velocity = 200;
	MaxDamage = 95;
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

		[this.Behavior, this.CastParams] = CreateBehaviorParams();

		this.Actions.StartThrow = new Action((End, janitor) => this.StartThrow(End, janitor));
		this.Actions.EndThrow = new Action((End, janitor) => this.EndThrow(End, janitor));

		this.Caster.LengthChanged.Connect((caster, lastpoint, dir, displacement, velocity, instance) => {
			this.BodyAttach.CFrame = CFrame.lookAt(lastpoint.add(dir.mul(displacement)), lastpoint).mul(
				CFrame.Angles(0, math.rad(90), 0),
			);
		});
		SetupRanged(this);

		this.Prompt.MaxActivationDistance = 4;
		task.defer(() => {
			this.Prompt.Parent = this.BodyAttach;
		});

		this.Prompt.Triggered.Connect((player) => {
			const Char = player.Character;
			if (Char && Char.IsA("Model")) {
				const Humanoid = Char.FindFirstChild("Humanoid");
				if (Humanoid && Humanoid.IsA("Humanoid") && Humanoid.Health > 0) {
					this.instance.Parent = Char;
					print(this.instance.Parent);
				}
			}
		});

		this.Prompt.RequiresLineOfSight = false;
	}

	RangedHit(result: RaycastResult) {
		this.LockedJoint = CreateWeld(this.BodyAttach, result.Instance);
		const Player = Players.GetPlayerFromCharacter(result.Instance.Parent);
		if (Player && result.Instance.Parent?.IsA("Model")) {
			const Char = result.Instance.Parent;
			const Humanoid = Char.FindFirstChildWhichIsA("Humanoid");
			const Head = Char.FindFirstChild("Head");

			if (Head && Head.IsA("Part") && Humanoid && Humanoid.Health <= 0) {
				task.wait(1);
				this.LockedJoint.Destroy();
				this.BodyAttach.Anchored = true;
				this.BodyAttach.Position = result.Instance.Position;
				this.LockedJoint = undefined;
			}
		}
		this.Prompt.Enabled = true;
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
			this.Trail.Lifetime = 4;
			this.instance.Parent = game.Workspace;
		}
	}

	WorkspaceInit = () => {};

	weaponPlayerInit() {
		print("PLAYER GOT INITED");
		ManageRay(this);
		if (this.LockedJoint) {
			this.Locked = false;
			this.LockedJoint.Destroy();
			this.LockedJoint = undefined;
		}
		this.BodyAttach.Anchored = false;
		this.Prompt.Enabled = false;
		this.BodyAttach.CanCollide = false;
		this.Trail.Lifetime = 0.2;
	}

	Destroy() {}
}
