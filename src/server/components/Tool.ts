/* eslint-disable roblox-ts/lua-truthiness */
import { OnInit, OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import Signal from "@rbxts/signal";
import { HttpService, RunService } from "@rbxts/services";
import { Events } from "server/events";
import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import { ParseInput } from "shared/modules/InputParser";
import { Action } from "server/modules/Action";
import { Defer } from "server/modules/Defer";
import { isBreakStatement, isPrivateIdentifier, TypePredicate } from "typescript";
import { Tools } from "shared/Config";
import Object, { deepCopy } from "@rbxts/object-utils";
import { MobileInput } from "shared/types";

export type ITool = Tool<ToolAttributes, ToolInstance>;

export type ActionInfo = {
	Action: string;
	Mobile?: {
		Position: UDim2;
		Image?: string;
	};
};

export type InputInfo = {
	// "EQUIPPED"
	[toolState: string]: {
		// "Begin"
		[UserInputState: string]: {
			// "One", "W", "P", ...
			[UserInput: string]: ActionInfo;
		};
	};
};

export interface ToolInstance extends Model {}

export interface ToolAttributes {
	BUTTON_TOGGLE: string;
}

export interface Actions {
	[actionName: string]: Action;
}

type ToolSignal = <T extends Tool<ToolAttributes, ToolInstance>>(tool: T) => void;
const ToolAdded = new Signal<ToolSignal>();
export { ToolAdded };

@Component()
export abstract class Tool<A extends ToolAttributes = ToolAttributes, I extends ToolInstance = ToolInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	public abstract className: string;
	public abstract readonly Incompatible: string[];
	public abstract Actions: Actions;
	public abstract InputInfo: InputInfo;
	private LastParent?: Instance;

	protected abstract PlayerInit?(player: Player): void;
	protected abstract WorkspaceInit?: () => void;
	protected abstract PlayerDestroy?: () => void;
	protected abstract Destroy(): void;

	public janitor = new Janitor();
	private ButtonedInputInfo?: InputInfo;
	public id = HttpService.GenerateGUID();
	public state = "nil";
	public timeCreated = tick();
	public Player?: Player;
	public stateChanged = new Signal<(state: string) => void>();

	onStart() {}

	public getState() {
		return this.state;
	}

	public setState(state: string) {
		this.state = state;
		this.stateChanged.Fire(state);
	}

	constructor() {
		super();
		Defer(() => {
			this.stateChanged.Connect((state) => this.UpdateMobileInput(state));
			this.ManageButtons();
			this.ManageAncestry();

			ToolAdded.Fire(this);
		});
	}

	private UpdateMobileInput(state: string) {
		if (!this.Player) {
			error(`state updated without a player? : ${state}`);
		}

		const InputInfo = this.ButtonedInputInfo;
		if (!InputInfo) {
			error("Could not find ButtonedInputInfo");
		}

		const StateInfo = InputInfo[state] || {};
		const inputs: MobileInput[] = [];

		Object.keys(StateInfo).forEach((State) => {
			Object.keys(StateInfo[State]).forEach((Input) => {
				if (typeIs(Input, "number") || typeIs(State, "number")) {
					error(`${this} has an invalid type ${Input} and state ${State}`);
				}

				const value = StateInfo[State][Input];

				if (value.Mobile) {
					inputs.push({
						Name: value.Action,
						Position: value.Mobile.Position,
						Image: value.Mobile.Image,
						Input: Input,
						State: State,
					});
				}
			});
		});

		Events.SetMobileInput(this.Player, this.id, inputs);
	}

	private ManageButtons() {
		for (const [key, value] of pairs(this.attributes as unknown as Map<never, never>)) {
			if (this.isButton(key)) {
				this.onAttributeChanged(key, (name) => {
					this.UpdateButtons();
				});
			}
		}
		this.UpdateButtons();
	}

	private ManageAncestry() {
		this.UpdateAncestry();
		this.instance.AncestryChanged.Connect(() => this.UpdateAncestry());
	}

	private UpdateAncestry() {
		if (this.instance.Parent !== this.LastParent) {
			this.LastParent = this.instance.Parent;

			this.janitor.Cleanup();
			const Player = Players.GetPlayerFromCharacter(this.instance.Parent);
			if (Player) {
				this.InitPlayer();
			} else {
				this.InitWorkspace();
			}
		} else if (!this.instance.IsDescendantOf(game)) {
			this.janitor.Cleanup();
			this.Destroy();
			pcall(() => {
				this.instance.Destroy();
			});
			return;
		}
	}

	private RequirePlayer() {
		const Player = Players.GetPlayerFromCharacter(this.instance.Parent);
		if (!Player) {
			error("attempting to call a function which requires the tool to be under a player");
		}
		return Player;
	}

	private InitPlayer() {
		this.Player = this.RequirePlayer();
		this.janitor.Add(this.SetupInput());
		this.Input("INIT", { Input: "None", State: "None" });

		opcall(() => {
			// @ts-expect-error its ok
			this.PlayerInit(this.Player);
		});
	}

	private InitWorkspace() {
		if (this.WorkspaceInit) {
			this.WorkspaceInit();
		} else {
			warn("this section // for dropping items // has not yet been implemented, did you mean to do this?");
			this.instance.Destroy();
		}

		if (this.PlayerDestroy) {
			this.PlayerDestroy();
		}
	}

	private SetupInput() {
		this.RequirePlayer();
		return Events.Input.connect((player, inputobject) => {
			if (this.Player === player) {
				const Input = inputobject.type === "UNPARSED" ? ParseInput(inputobject) : inputobject;
				this.Input(this.getState(), Input);
			}
		});
	}

	private Input(state: string, input: { Input: string; State: string }) {
		const [Player, Char] = this.GetCharPlayer();
		const Humanoid = Char.FindFirstChildOfClass("Humanoid");
		if (!Humanoid || Humanoid.Health <= 0) {
			return;
		}
		const ActionInfo = this.GetActionInfo(state, input);
		if (ActionInfo === undefined) {
			return;
		}
		const Action = this.Actions[ActionInfo.Action];
		if (!Action) {
			error(`action ${ActionInfo.Action} does not exist`);
		}

		this.AddAction(Action);
	}

	private AddAction(Action: Action) {
		Action.Start();
	}

	private GetActionInfo(toolState: string, input: { Input: string; State: string }): ActionInfo | undefined {
		const InputInfo = this.ButtonedInputInfo;
		if (!InputInfo) {
			error();
		}
		if (
			!InputInfo[toolState] ||
			!InputInfo[toolState][input.State] ||
			!InputInfo[toolState][input.State][input.Input]
		) {
			return;
		}

		return InputInfo[toolState][input.State][input.Input];
	}

	/** updates the ButtonedInputInfo to be accurate to newly assigned buttons */
	private UpdateButtons() {
		this.ButtonedInputInfo = this.fillButtonsInTable(this.InputInfo);
	}

	/**
	 *
	 * Takes in a table and loops through its indexes and values. Ensures that all of it's indexes if buttons are set to their actual attribute value and if any of it's values are tables that their indexes are also checked and made sure that any buttons in their indexes are set to their actual attribute values aswell.
	 *
	 * @example
	 *
	 * ```typescript
	 * const Table: InputInfo = {
	 * 		Holstered: {
	 *			Begin: {
	 *				BUTTON_TOGGLE: {
	 *					Action = "Equip"
	 *				}
	 *			}
	 * 		}
	 * }
	 *
	 * const ButtonedInputInfo = fillButtonsInTable(Table) where this.attributes = { BUTTON_TOGGLE: "One" } // "One" being representative of the 1 key on the keyboard
	 *
	 * // what ButtonedInputInfo is equal to:
	 * // notice the purpose is to remove all BUTTON_ and replace them with their actual value
	 * {
	 * 		Holstered: {
	 *			Begin: {
	 *				One: {
	 *					Action = "Equip"
	 *				}
	 *			}
	 *		}
	 * 	}
	 * ```
	 *
	 * @param Table a table which has a string index
	 * @returns A Table who's indexes if buttons were replaced by their actual value
	 */
	private fillButtonsInTable<T extends { [key: string]: unknown }>(Table: T) {
		Table = deepCopy(Table);
		const newTable = {};

		for (let [key, value] of pairs(Table as unknown as Map<never, never>)) {
			// EXAMPLE: key might equal "CUSTOM_TOGGLE" and this.attributes might equal {"CUSTOM_TOGGLE": "MouseButton1"}
			if (this.isButton(key)) {
				const Button = this.instance.GetAttribute(key);
				if (Button && typeIs(Button, "string")) {
					key = Button as never;
				}
			}

			if (typeIs(value, "table")) {
				value = this.fillButtonsInTable(value);
			}

			newTable[key] = value;
		}

		return newTable as T;
	}

	/** returns if the string is an identifier for a button */
	private isButton(str: string): boolean {
		return string.sub(str, 0, 7) === "BUTTON_";
	}

	public GetCharPlayer() {
		const Player = this.Player;
		if (!Player) {
			error("player required");
		}
		const Character = Player.Character;
		if (!Character) {
			error("character required");
		}

		return [Player, Character] as [Player, Model];
	}
}
