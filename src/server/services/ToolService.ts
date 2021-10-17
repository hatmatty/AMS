import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import Config, { Attributes } from "shared/Config";
import { ReplicatedStorage, CollectionService, Players } from "@rbxts/services";
import { ITool, Tool, ToolAdded, ToolAttributes, ToolInstance } from "server/components/Tool";
import Rodux, { Store, StoreChangedSignal } from "@rbxts/rodux";
import { isExpressionWithTypeArguments, UnderscoreEscapedMap } from "typescript";
import { Events } from "server/events";
import Signal from "@rbxts/signal";

export interface State {
	[parent: string]: ITool[] | undefined;
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
	tool: ITool;
	parent: string;
	type: "TOOL_ADDED";
}

interface toolRemoved {
	tool: ITool;
	parent: string;
	type: "TOOL_REMOVED";
}

interface init {
	type: "@@INIT";
}

type Actions = init | toolAdded | playerAdded | playerRemoved | toolRemoved;

const store_PlayerAdded = new Signal<(state: State, playerName: string) => void>();
const store_PlayerRemoved = new Signal<(state: State, playerName: string) => void>();
const store_ToolAdded = new Signal<(state: State, parent: string, tool: ITool) => void>();
const store_ToolRemoved = new Signal<(state: State, parent: string, tool: ITool) => void>();

export {
	store_PlayerAdded as PlayerAdded,
	store_PlayerRemoved as PlayerRemoved,
	store_ToolAdded as ToolAdded,
	store_ToolRemoved as ToolRemoved,
};

const Reducer: Rodux.Reducer<State, Actions> = (state: State, action: Actions) => {
	switch (action.type) {
		case "@@INIT": {
			return {
				Workspace: [],
			};
		}
		case "TOOL_ADDED": {
			const tools = state[action.parent];
			if (!tools) {
				error(`attempting to add tool ${action.tool} to parent ${action.parent} which does not exist`);
			}
			tools.push(action.tool);

			store_ToolAdded.Fire(state, action.parent, action.tool);
			return state;
		}
		case "TOOL_REMOVED": {
			const tools = state[action.parent];
			if (!tools) {
				return state;
			}

			tools.remove(
				tools.findIndex((tool) => {
					return tool === action.tool;
				}),
			);

			store_ToolRemoved.Fire(state, action.parent, action.tool);
			return state;
		}
		case "PLAYER_ADDED": {
			state[action.playerName] = [];

			store_PlayerAdded.Fire(state, action.playerName);
			return state;
		}
		case "PLAYER_REMOVED": {
			state[action.playerName] = undefined;

			store_PlayerRemoved.Fire(state, action.playerName);
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
	public store = new Store<State, Actions>(Reducer);

	onInit() {
		this.InitStore();
	}

	private InitStore() {
		print("INITED TOOLSERVICE STORE");

		for (const player of Players.GetPlayers()) {
			this.store.dispatch({ type: "PLAYER_ADDED", playerName: player.Name });
		}

		Players.PlayerAdded.Connect((player) => {
			this.store.dispatch({ type: "PLAYER_ADDED", playerName: player.Name });
		});
		Players.PlayerRemoving.Connect((player) => {
			this.store.dispatch({ type: "PLAYER_REMOVED", playerName: player.Name });
		});

		ToolAdded.Connect((tool) => {
			this.InitTool(tool);
		});
	}

	InitTool(tool: ITool) {
		const Player = Players.GetPlayerFromCharacter(tool.instance.Parent);
		const ParentInstance = tool.instance.Parent;
		let Parent: string;
		if (Player) {
			Parent = Player.Name;
		} else {
			Parent = "Workspace";
		}

		this.store.dispatch({ type: "TOOL_ADDED", parent: Parent, tool: tool });

		const AncestryChanged = tool.instance.AncestryChanged.Connect(() => {
			if (tool.instance.Parent === ParentInstance) {
				return;
			}
			AncestryChanged.Disconnect();

			this.store.dispatch({ type: "TOOL_REMOVED", parent: Parent, tool: tool });

			if (tool.instance.IsDescendantOf(game)) {
				this.InitTool(tool);
			}
		});
	}

	public addTool(toolName: keyof typeof Config.Tools, parent: Player | Instance) {
		const Tag = Config.Tools[toolName];
		if (Tag === undefined) {
			error(`tool name proived: ${toolName} was not found in the config `);
		}

		let ToolModel = ReplicatedStorage.Assets.Tools.FindFirstChild(toolName);
		if (!ToolModel) {
			error(`Tool model for tool ${toolName} not found in replicated storage/assets/tools`);
		}

		ToolModel = ToolModel.Clone();

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

		CollectionService.AddTag(ToolModel, Tag);
	}
}
