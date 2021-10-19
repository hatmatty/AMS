import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import Config, { Attributes } from "shared/Config";
import { ReplicatedStorage, CollectionService, Players } from "@rbxts/services";
import { ITool, ToolAdded, ToolAttributes, ToolInstance } from "server/components/Tool";
import Rodux, { Store, StoreChangedSignal } from "@rbxts/rodux";
import { isExpressionWithTypeArguments, UnderscoreEscapedMap } from "typescript";
import { Events } from "server/events";
import Signal from "@rbxts/signal";

export interface State {
	[parent: string]: (ITool | Tool)[] | undefined;
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
	tool: ITool | Tool;
	parent: string;
	type: "TOOL_ADDED";
}

interface toolRemoved {
	tool: ITool | Tool;
	parent: string;
	type: "TOOL_REMOVED";
}

interface init {
	type: "@@INIT";
}

type Actions = init | toolAdded | playerAdded | playerRemoved | toolRemoved;

const store_PlayerAdded = new Signal<(state: State, playerName: string) => void>();
const store_PlayerRemoved = new Signal<(state: State, playerName: string) => void>();
const store_ToolAdded = new Signal<(state: State, parent: string, tool: ITool | Tool) => void>();
const store_ToolRemoved = new Signal<(state: State, parent: string, tool: ITool | Tool) => void>();

export {
	store_PlayerAdded as PlayerAdded,
	store_PlayerRemoved as PlayerRemoved,
	store_ToolAdded as ToolAdded,
	store_ToolRemoved as ToolRemoved,
};

/**
 *
 * Takes in various actions to update a store to accurately store information about a player's tools.
 *
 * @param state - the current state of the store
 * @param action - the action to effect the state
 * @returns a new state to replace the old one
 */
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
			error(`got action.. ${action}`);
		}
	}
	return state;
};

/**
 * Manages the state of a player's tools and contains utility functions for interfacing with tools.
 */
@Service({})
export class ToolService implements OnInit {
	public store = new Store<State, Actions>(Reducer);

	onInit() {
		this.InitStore();
		this.InitModelInterface();
	}

	/**
	 * Begins the tool-model interface to allow empty models to create AET tools.
	 */
	private InitModelInterface() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect(() => {
				const Backpack = player.FindFirstChild("Backpack");
				if (!Backpack || !Backpack.IsA("Backpack")) {
					error();
				}

				for (const instance of Backpack.GetChildren()) {
					this.TryAddModelToTool(instance, player);
				}

				Backpack.ChildAdded.Connect((child) => this.TryAddModelToTool(child, player));
			});
		});
	}

	/**
	 * Makes an empty model with a tool's name into a tool if compatible and then tracks when the model is destroyed which destroys the tool.
	 * @param instance an instance which if a model will be made into a tool
	 */
	private TryAddModelToTool(instance: Instance, parent: Player) {
		if (instance.IsA("Model") && instance.GetDescendants().size() === 0) {
			if (!parent.Character) {
				return;
			}
			const tool = this.addTool(instance.Name as never, parent);
			instance.AncestryChanged.Connect(() => {
				if (tool.Parent?.Parent === parent) {
					return;
				}
				if (!instance.IsDescendantOf(game)) {
					tool.Destroy();
				}
			});
		}
	}

	/**
	 * Initalizes the tool store by connecting to various events to ensure the tool store is always up to date.
	 */
	private InitStore() {
		print("INITED TOOLSERVICE STORE");

		for (const player of Players.GetPlayers()) {
			this.store.dispatch({ type: "PLAYER_ADDED", playerName: player.Name });
		}

		Players.PlayerAdded.Connect((player) => {
			print("INITED PLAYER");
			this.store.dispatch({ type: "PLAYER_ADDED", playerName: player.Name });
			this.InitRobloxTool(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.store.dispatch({ type: "PLAYER_REMOVED", playerName: player.Name });
		});

		ToolAdded.Connect((tool) => {
			this.InitTool(tool);
		});
	}

	/**
	 * @param player the player whose backpack will be checked for tool additions
	 */
	private InitRobloxTool(player: Player) {
		const Character = player.Character;
		if (Character) {
			this.InitRobloxToolCharacter(player, Character);
		}
		player.CharacterAdded.Connect((character) => this.InitRobloxToolCharacter(player, character as Model));
	}

	InitRobloxToolCharacter(player: Player, Character: Model) {
		const Backpack = player.FindFirstChild("Backpack");
		if (!Backpack || !Backpack.IsA("Backpack")) {
			error();
		}

		for (const instance of Backpack.GetChildren()) {
			this.TryStoreRobloxTool(instance, player);
		}

		Backpack.ChildAdded.Connect((item) => this.TryStoreRobloxTool(item, player));
	}

	/**
	 * @param tool the tool to add to the store
	 * @param player the parent property to give when sending the store action
	 */
	private TryStoreRobloxTool(tool: Instance, player: Player) {
		print(tool, player);
		if (!tool.IsA("Tool")) {
			return;
		}

		this.store.dispatch({ type: "TOOL_ADDED", tool: tool, parent: player.Name });

		tool.AncestryChanged.Connect(() => {
			if (!tool.IsDescendantOf(game)) {
				this.store.dispatch({ type: "TOOL_REMOVED", tool: tool, parent: player.Name });
			}
		});
	}

	/**
	 * Tracks a tool so that it's information if properly displayed in the tool store.
	 *
	 * @param tool - The tool to be tracked in the tool store
	 */
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

	/**
	 * Creates a new tool which has the model of the toolName provided and parents the tool to the parent provided.
	 *
	 * @param toolName name of a tool model
	 * @param parent a player or part to parent the tool to
	 */
	public addTool(toolName: keyof typeof Config.Tools, parent: Player | Instance): Model {
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

		if (!ToolModel.IsA("Model")) {
			error();
		}

		return ToolModel;
	}
}
