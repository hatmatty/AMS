import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { State } from "./ToolService";
import { CollectionService, Players } from "@rbxts/services";
import { ITool } from "server/components/Tool";
import { ToolAdded, ToolRemoved } from "./ToolService";
import { ParseInput } from "shared/modules/InputParser";
import { HttpService } from "@rbxts/services";
import { RbxTool } from "./RbxTool";

/**
 * Hooks into ToolService's ToolAdded and ToolRemoved events and updates all of a player's tool to have updated buttons and fires a button event with informoration on the new buttons.
 */
@Service({})
export class ToggleButton implements OnInit {
	constructor(private RbxTool: RbxTool) {}
	/**
	 * Connects to the ToolAdded and ToolRemoved and calls ConfigureToggleButtons with the arguments from the connections.
	 */
	onInit() {
		ToolAdded.Connect((state, parent, tool) => this.ConfigureToggleButtons(state, parent, tool, "ADDED"));
		ToolRemoved.Connect((state, parent, tool) => this.ConfigureToggleButtons(state, parent, tool, "REMOVED"));
	}

	/**
	 *
	 * Takes in a copy of a state from the tool store in toolservice and a parent which is the name of a player and re-configures all of the BUTTON_TOGGLE attributes of the player's tools.
	 *
	 * @param state - a copy of a state from toolservice
	 * @param parent - a string that will cause an error if it does not match up to a player's username in the game
	 */
	private ConfigureToggleButtons(
		state: State,
		parent: string,
		modifiedTool: Tool | ITool,
		action: "ADDED" | "REMOVED",
	) {
		const player = this.GetPlayerFromUserName(parent);

		if (player === undefined) {
			// got workspace
			return;
		}

		const playerTools = state[parent];
		if (!playerTools) {
			error(`tools for player ${parent} not found`);
		}

		playerTools.sort((a, b) => {
			const aOrder = this.getOrder(a);
			const bOrder = this.getOrder(b);

			const aTimeCreated = typeIs(a, "Instance")
				? (this.RbxTool.GetAttribute(a, "timeCreated", "number") as number)
				: a.timeCreated;
			const bTimeCreated = typeIs(b, "Instance")
				? (this.RbxTool.GetAttribute(b, "timeCreated", "number") as number)
				: b.timeCreated;

			if (aOrder !== bOrder) {
				return aOrder > bOrder;
			} else {
				return aTimeCreated < bTimeCreated;
			}
		});

		if (action === "REMOVED") {
			if (typeIs(modifiedTool, "Instance")) {
				Events.ButtonChanged(
					player,
					"REMOVED",
					this.RbxTool.GetAttribute(modifiedTool, "id", "string") as string,
				);
			} else {
				Events.ButtonChanged(player, "REMOVED", modifiedTool.id);
			}
		}

		const getNum = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

		let index = 0;
		playerTools.forEach((tool) => {
			const IsRobloxTool = typeIs(tool, "Instance");

			const Instance = IsRobloxTool ? tool : tool.instance;

			if (index > 9) {
				return warn("further adding of tools will not get any new buttons");
			}

			Instance.SetAttribute("BUTTON_TOGGLE", getNum[index]);

			const id = typeIs(tool, "Instance") ? (this.RbxTool.GetAttribute(tool, "id", "string") as string) : tool.id;

			if (tool === modifiedTool) {
				Events.ButtonChanged(player, "ADDED", id, Instance, index + 1);
			} else {
				Events.ButtonChanged(player, "UPDATED", id, Instance, index + 1);
			}

			index++;
		});
	}

	/**
	 * Gets a tool object and returns a number which indicates what priority in sorting tool buttons the tool should have (higher then number means the tool will be sorted closer to first)
	 */
	private getOrder(tool: ITool | Tool): number {
		if (typeIs(tool, "Instance")) {
			return -1;
		}

		if (CollectionService.HasTag(tool.instance, "Sword")) {
			return 4;
		} else if (CollectionService.HasTag(tool.instance, "Spear")) {
			return 3;
		} else if (CollectionService.HasTag(tool.instance, "Bow")) {
			return 2;
		} else if (CollectionService.HasTag(tool.instance, "Shield")) {
			return 1;
		} else {
			return 0;
		}
	}

	/**
	 * @param playerName - a player's username
	 * @returns a Player if it found a player from the username provided or undefined.
	 */
	private GetPlayerFromUserName(playerName: string): Player | undefined {
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const player of Players.GetChildren()) {
			if (player.Name === playerName) {
				return player as Player;
			}
		}

		return undefined;
	}
}
