/* eslint-disable roblox-ts/lua-truthiness */
import { OnInit, OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import Signal from "@rbxts/signal";
import { HttpService } from "@rbxts/services";
import { Events } from "server/events";
import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import { ParseInput } from "server/modules/InputParser";
import { Action } from "server/modules/Action";
import { Defer } from "server/modules/Defer";
import { TypePredicate } from "typescript";
import { Tools } from "shared/Config";
import { deepCopy } from "@rbxts/object-utils";

export type ITool = Tool<ToolAttributes, ToolInstance>;

export type ActionInfo = {
	Action: string;
	Mobile?: {};
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

export interface ToolInstance extends Model {
	BodyAttach: BasePart;
}

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
export abstract class Tool<A extends ToolAttributes, I extends ToolInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	public abstract Incompatible: string[];
	public abstract Actions: Actions;
	public abstract InputInfo: InputInfo;
	public abstract Init?(): void;
	public abstract PlayerInit?(): void;

	protected janitor = new Janitor();
	private ButtonedInputInfo?: InputInfo;
	public id = HttpService.GenerateGUID();
	public state = "nil";
	public timeCreated = tick();
	public Player?: Player;
	public stateChanged = new Signal<(state: string) => void>();

	public getState() {
		return this.state;
	}

	public setState(state: string) {
		this.state = state;
		this.stateChanged.Fire(state);
	}

	onStart() {
		// Not sure if using promise.defer is a hacky way or a legit way to acces the abstract methods and properties. Trying to access in onStart() without deferring will result in a nil value.
		Defer(() => {
			this.maid.GiveTask(this.janitor);

			this.ManageButtons();
			this.ManageAncestry();

			ToolAdded.Fire(this);

			if (this.Init !== undefined) {
				this.Init();
			}
		});
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
		if (!this.instance.IsDescendantOf(game)) {
			pcall(() => {
				this.instance.Destroy();
			});
		} else if (Players.GetPlayerFromCharacter(this.instance.Parent) !== this.Player) {
			this.janitor.Cleanup();
			this.InitPlayer();
		} else {
			this.janitor.Cleanup();
			this.InitWorkspace();
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

		if (this.PlayerInit !== undefined) {
			this.PlayerInit();
		}
	}

	private InitWorkspace() {
		warn("this section // for dropping items // has not yet been implemented, did you mean to do this?");
	}

	private SetupInput() {
		this.RequirePlayer();
		return Events.Input.connect((player, inputobject) => {
			if (this.Player === player) {
				const Input = ParseInput(inputobject);
				this.Input(this.getState(), Input);
			}
		});
	}

	private Input(state: string, input: { Input: string; State: string }) {
		this.RequirePlayer();
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

	protected GetCharPlayer() {
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
