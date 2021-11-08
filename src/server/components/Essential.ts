import { Component, Components } from "@flamework/components";
import { Tool, ToolAttributes, ToolInstance, InputInfo, Actions, ITool } from "./Tool";
import { Action } from "server/modules/Action";
import { CharacterLimb } from "shared/Types";
import { playAnim } from "server/modules/AnimPlayer";
import { CollectionService } from "@rbxts/services";
import { Dependency, OnStart } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import { BaseComponent } from "@rbxts/flamework";
import { DisableIncompatibleTools } from "server/modules/IncompatibleTools";
import { Events } from "server/events";
import { HighlightSpanKind } from "typescript";

const components = Dependency<Components>();

/**
 * The base class for both the shield and sword.
 *
 * @states - "Enabled", "Disabled"
 */
@Component()
export abstract class Essential<A extends ToolAttributes, I extends ToolInstance>
	extends Tool<A, I>
	implements OnStart
{
	public abstract EnableAnimation: number;
	public abstract DisableAnimation: number;
	protected abstract AttachName: string;
	protected abstract EnabledLimb: CharacterLimb;
	protected abstract DisabledLimb: CharacterLimb;
	protected abstract playerInit(Player: Player): void;

	public EssentialAnimation?: AnimationTrack;
	protected Motor6D?: Motor6D;
	// workaround
	public BodyAttach: BasePart = new Instance("Part");

	InputInfo = {
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

		task.defer(() => {
			const BodyAttach = this.instance.FindFirstChild(this.AttachName);
			if (!BodyAttach || !BodyAttach.IsA("BasePart")) {
				error(`AttachName is not ${this.AttachName}, got ${BodyAttach}`);
			}

			this.BodyAttach = BodyAttach;
		});
	}

	protected PlayerInit(player: Player) {
		print("Initting Player", player);
		this.Actions.Disable.Start();
		this.playerInit(player);
	}

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
	}

	protected GetLimb(limbName: CharacterLimb): BasePart {
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

	protected SetMotor6D(limb: BasePart) {
		print(limb, this.BodyAttach);
		if (!this.Motor6D) {
			print("ERROR!");
			error("Motor6D required");
		}

		print(1);
		this.Motor6D.Parent = this.BodyAttach;
		print(2);
		this.Motor6D.Part0 = limb;
		print(3);
		this.Motor6D.Part1 = this.BodyAttach;
		print(4);
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
					return End();
				}

				Limb = this.EnabledLimb;
				Animation = this.EnableAnimation;
				Events.ToolToggled(Player, this.id, "Enabled");
			} else {
				Limb = this.DisabledLimb;
				Animation = this.DisableAnimation;
				Events.ToolToggled(Player, this.id, "Disabled");
			}

			print(5);

			if (!this.Motor6D || !this.Motor6D.IsDescendantOf(game)) {
				this.Setup();
			}

			print(6);

			this.SetMotor6D(this.GetLimb(Limb));

			print(7);

			if (this.EssentialAnimation) {
				this.EssentialAnimation.Stop();
			}

			print(8);

			this.EssentialAnimation = playAnim(Player, Animation, { Looped: true });
			this.setState(option + "d");
			End();
			print(10);
		};
	}

	onStart() {}

	protected Enable = this.create("Enable");

	protected Disable = this.create("Disable");

	PlayerDestroy = () => {
		if (!this.Player) {
			error("Player required to destroy.");
		}
		this.Motor6D?.Destroy();
		this.Motor6D = undefined;
		this.EssentialAnimation?.Stop();
		this.EssentialAnimation = undefined;
		Events.ToolToggled(this.Player, this.id, "Disabled");
	};

	Actions = {
		Enable: new Action((End) => this.Enable(End)),
		Disable: new Action((End) => this.Disable(End)),
	} as Actions;
}
