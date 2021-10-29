import { Component, Components } from "@flamework/components";
import { Tool, ToolAttributes, ToolInstance, InputInfo, Actions, ITool } from "./Tool";
import { Action } from "server/modules/Action";
import { CharacterLimb } from "shared/Types";
import { playAnim } from "server/modules/AnimPlayer";
import { CollectionService } from "@rbxts/services";
import { Dependency } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import { BaseComponent } from "@rbxts/flamework";
import { DisableIncompatibleTools } from "server/modules/IncompatibleTools";
import { Events } from "server/events";

const components = Dependency<Components>();

/**
 * The base class for both the shield and sword.
 *
 * @states - "Enabled", "Disabled"
 */
@Component()
export abstract class Essential<A extends ToolAttributes, I extends ToolInstance> extends Tool<A, I> {
	public abstract EnableAnimation: number;
	public abstract DisableAnimation: number;
	protected abstract EnabledLimb: CharacterLimb;
	protected abstract DisabledLimb: CharacterLimb;
	protected abstract playerInit(Player: Player): void;

	public EssentialAnimation?: AnimationTrack;
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

	constructor() {
		super();
		this.ManageStatusAttribute();
	}

	protected PlayerInit = (player: Player) => {
		print("ESSENTIAL ADDED");

		this.playerInit(player);
	};

	private ManageStatusAttribute() {
		this.instance.GetAttributeChangedSignal("Status").Connect(() => {
			const attribute = this.instance.GetAttribute("Status");
			if (attribute === undefined || !typeIs(attribute, "string")) {
				error();
			}

			if (attribute === this.state) {
				return;
			}

			const Action = this.Actions[attribute];
			if (Action && Action.Status === "STARTED") {
				return;
			}

			switch (attribute) {
				case "Disabled": {
					return this.Actions.Disable.Start();
				}
				case "Enabled": {
					return this.Actions.Enable.Start();
				}
			}
		});

		this.stateChanged.Connect((state: string) => {
			if (state === "Disabled" || state === "Enabled") {
				this.instance.SetAttribute("Status", state);
			} else {
				this.instance.SetAttribute("Status", "Active");
			}
		});
	}

	private CanEquip(): boolean {
		const [Player, Character] = this.GetCharPlayer();
		return DisableIncompatibleTools(Character, this.Incompatible, [this.instance]);
		return true;
	}

	private GetLimb(limbName: CharacterLimb): BasePart {
		const [Player, Character] = this.GetCharPlayer();

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
		this.Motor6D.Name = model.Name + "Grip" + this.id;
		this.SetMotor6D(Limb);
	}

	private create(option: "Enable" | "Disable") {
		return (End: Callback) => {
			const [Player, Character] = this.GetCharPlayer();
			let Limb;
			let Animation;
			if (option === "Enable") {
				if (!this.CanEquip()) {
					return;
				}

				Limb = this.EnabledLimb;
				Animation = this.EnableAnimation;
				Events.ToolToggled(Player, this.id, "Enabled");
			} else {
				Limb = this.DisabledLimb;
				Animation = this.DisableAnimation;
				Events.ToolToggled(Player, this.id, "Disabled");
			}

			if (!this.Motor6D) {
				this.Setup();
			}

			this.SetMotor6D(this.GetLimb(Limb));

			if (this.EssentialAnimation) {
				this.EssentialAnimation.Stop();
			}

			this.EssentialAnimation = playAnim(Player, Animation, { Looped: true });
			this.setState(option + "d");
			End();
		};
	}

	protected Enable = this.create("Enable");

	protected Disable = this.create("Disable");

	Actions = {
		Enable: new Action((End) => this.Enable(End)),
		Disable: new Action((End) => this.Disable(End)),
	} as Actions;
}
