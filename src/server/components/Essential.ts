import { Component } from "@flamework/components";
import { Tool, ToolAttributes, ToolInstance, InputInfo, Actions } from "./Tool";
import { Action } from "server/modules/Action";
import { CharacterLimb } from "shared/Types";
import { playAnim } from "server/modules/AnimPlayer";

@Component()
export abstract class Essential<A extends ToolAttributes, I extends ToolInstance> extends Tool<A, I> {
	protected abstract EnableAnimation: number;
	protected abstract DisableAnimation: number;
	protected abstract EnabledLimb: CharacterLimb;
	protected abstract DisabledLimb: CharacterLimb;

	private EssentialAnimation?: AnimationTrack;
	private Motor6D?: Motor6D;

	InputInfo = {
		INIT: {
			None: {
				None: {
					Action: "Disable",
				},
			},
		},
		Disabled: {
			End: {
				BUTTON_TOGGLE: {
					Action: "Enable",
				},
			},
		},
		Enabled: {
			End: {
				BUTTON_TOGGLE: {
					Action: "Disable",
				},
			},
		},
	} as InputInfo;

	private GetLimb(limbName: CharacterLimb): BasePart {
		const Player = this.Player;
		if (!Player) {
			error("player required");
		}
		const Character = Player.Character;
		if (!Character) {
			error("character required");
		}

		const Limb = Character.FindFirstChild(limbName);
		if (!Limb) {
			error("Most likely got incorrect value");
		}
		if (!Limb.IsA("BasePart")) {
			error("expected basepart");
		}
		return Limb;
	}

	private SetMotor6D(limb: BasePart) {
		if (!this.Motor6D) {
			error("Motor6D required");
		}

		this.Motor6D.Part0 = limb;
		this.Motor6D.Part1 = this.instance.BodyAttach;
		this.Motor6D.Parent = limb;
	}

	private Setup() {
		const model = this.instance;
		const Limb = this.GetLimb(this.DisabledLimb);

		this.Motor6D = new Instance("Motor6D");
		this.Motor6D.Name = model.Name + "Grip";
		this.SetMotor6D(Limb);
	}

	private create(option: "Enable" | "Disable") {
		return (End: Callback) => {
			let Limb;
			let Animation;
			if (option === "Enable") {
				Limb = this.EnabledLimb;
				Animation = this.EnableAnimation;
			} else {
				Limb = this.DisabledLimb;
				Animation = this.DisableAnimation;
			}

			if (!this.Motor6D) {
				this.Setup();
			}

			this.SetMotor6D(this.GetLimb(Limb));

			if (this.EssentialAnimation) {
				this.EssentialAnimation.Stop();
			}

			this.EssentialAnimation = playAnim(this.Player, Animation, { Looped: true });
			print(this.EssentialAnimation);
			this.setState(option + "d");

			End();
		};
	}

	Enable = this.create("Enable");

	Disable = this.create("Disable");

	Actions = {
		Enable: new Action((End) => this.Enable(End)),
		Disable: new Action((End) => this.Disable(End)),
	} as Actions;
}
