import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import Config, { Attributes } from "shared/Config";
import { ReplicatedStorage, CollectionService, Players } from "@rbxts/services";
import { Tool, ToolAdded, ToolAttributes, ToolInstance } from "server/components/Tool";
import Rodux, { Store, StoreChangedSignal } from "@rbxts/rodux";
import { isExpressionWithTypeArguments, UnderscoreEscapedMap } from "typescript";
import { Events } from "server/events";

interface IStore {
	[parent: string]: Tool<ToolAttributes, ToolInstance>[] | undefined;
}

interface playerAdded {
	type: "PLAYER_ADDED";
	playerName: string;
}

interface playerRemoved {
	type: "PLAYER_REMOVED";
	playerName: string;
}

interface toolAdded {
	tool: Tool<ToolAttributes, ToolInstance>;
	parent: string;
	type: "TOOL_ADDED";
}

interface init {
	type: "@@INIT";
}

type IActions = init | toolAdded | playerAdded | playerRemoved;

const Reducer: Rodux.Reducer<IStore, IActions> = (state: IStore, action: IActions) => {
	switch (action.type) {
		case "@@INIT": {
			return {
				Workspace: [],
			};
		}
		case "TOOL_ADDED": {
			if (!state[action.parent]) {
				error(`attempting to add tool ${action.tool} to parent ${action.parent} which does not exist`);
			}
			state[action.parent]?.push(action.tool);
			return state;
		}
		case "PLAYER_ADDED": {
			return {
				[action.playerName]: [],
				...state,
			};
		}
		case "PLAYER_REMOVED": {
			state[action.playerName] = undefined;
			return state;
		}
		default: {
			const _exhaustiveCheck: never = action;
		}
	}
	return state;
};

@Service({})
export class ToolService implements OnInit {
	public store = new Store<IStore, IActions>(Reducer);

	onInit() {
		this.InitStore();
		this.InitToggleButtons();
	}

	private InitToggleButtons() {
		this.store.changed.connect((newState, oldState) => {
			// eslint-disable-next-line roblox-ts/no-array-pairs
			for (const [parent, tools] of pairs(newState)) {
				const Parent = parent as string;

				if (parent === "Workspace") {
					continue;
				}

				// new player added
				if (!oldState[Parent]) {
					this.ConfigureToggleButtons(Parent);
				}

				// parent's tool array changed
				if (newState[Parent] !== oldState[Parent]) {
					this.ConfigureToggleButtons(Parent);
				}
			}
		});
	}

	private InitStore() {
		Players.PlayerAdded.Connect((player) => {
			this.store.dispatch({ type: "PLAYER_ADDED", playerName: player.Name });
		});
		Players.PlayerRemoving.Connect((player) => {
			this.store.dispatch({ type: "PLAYER_REMOVED", playerName: player.Name });
		});

		ToolAdded.Connect((tool) => {
			const Player = Players.GetPlayerFromCharacter(tool.instance.Parent);
			if (Player) {
				this.store.dispatch({ type: "TOOL_ADDED", parent: Player.Name, tool: tool });
			} else {
				this.store.dispatch({ type: "TOOL_ADDED", parent: "Workspace", tool: tool });
			}
		});
	}

	private ConfigureToggleButtons(parent: string) {
		const player = this.GetPlayerFromUserName(parent);

		if (player === undefined) {
			error("parent must be a player's username");
		}

		const playerTools = this.store.getState()[parent];
		if (!playerTools) {
			error(`tools for player ${parent} not found`);
		}

		playerTools.sort((a, b) => {
			const aOrder = this.getOrder(a);
			const bOrder = this.getOrder(b);

			if (aOrder !== bOrder) {
				return aOrder > bOrder;
			} else {
				return a.timeCreated < b.timeCreated;
			}
		});

		const getNum = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

		let index = 0;
		playerTools.forEach((tool) => {
			if (index > 8) {
				error("a player can only have 9 tools maximum!");
			}

			tool.setAttribute("BUTTON_TOGGLE", getNum[index]);
			Events.ButtonChanged(player, tool.instance, index + 1);
			index++;
		});
	}

	private getOrder(tool: Tool<ToolAttributes, ToolInstance>): number {
		if (CollectionService.HasTag(tool.instance, "Weapon")) {
			return 1;
		}
		return 0;
	}

	private GetPlayerFromUserName(playerName: string): Player | undefined {
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key, player] of pairs(Players.GetChildren())) {
			if (player.Name === playerName) {
				return player as Player;
			}
		}

		return undefined;
	}

	public addTool(toolName: keyof typeof Config.Tools, parent: Player | Instance) {
		const ToolConfig = Config.Tools[toolName];
		if (!ToolConfig) {
			error(`tool name proived: ${toolName} was not found in the config `);
		}

		const ToolModel = ReplicatedStorage.Assets.Tools.FindFirstChild(toolName);
		if (!ToolModel) {
			error(`Tool model for tool ${toolName} not found in replicated storage/assets/tools`);
		}

		if (parent && parent.IsA("Player")) {
			const Character = parent.Character;
			if (!Character) {
				error(
					`attempting to give tool ${toolName} to player ${parent.Name} whose character has not spawned in`,
				);
			}
			ToolModel.Parent = Character;
		} else {
			ToolModel.Parent = parent;
		}

		CollectionService.AddTag(ToolModel, ToolConfig.Tag);
	}
}
