import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { ToolService, State } from "./ToolService";
import { CollectionService, Players } from "@rbxts/services";
import { ITool } from "server/components/Tool";
import { ToolAdded, ToolRemoved } from "./ToolService";

/**
 * Hooks into ToolService's ToolAdded and ToolRemoved events and updates all of a player's tool to have updated buttons and fires a button event with informoration on the new buttons.
 */
@Service({})
export class ToggleButton implements OnInit {
	/**
	 * Connects to the ToolAdded and ToolRemoved and calls ConfigureToggleButtons with the arguments from the connections.
	 */
	onInit() {
		ToolAdded.Connect((store, parent) => this.ConfigureToggleButtons(store, parent));
		ToolRemoved.Connect((store, parent) => this.ConfigureToggleButtons(store, parent));
	}
	
	/**
	 * 
	 * Takes in a copy of a state from the tool store in toolservice and a parent which is the name of a player and re-configures all of the BUTTON_TOGGLE attributes of the player's tools.
	 * 
	 * @param state - a copy of a state from toolservice
	 * @param parent - a string that will cause an error if it does not match up to a player's username in the game
	 */
	private ConfigureToggleButtons(state: State, parent: string) {
		const player = this.GetPlayerFromUserName(parent);

		if (player === undefined) {
			error("parent must be a player's username");
		}

		const playerTools = state[parent];
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
	
	/**
	 * Gets a tool object and returns a number which indicates what priority in sorting tool buttons the tool should have (higher then number means the tool will be sorted closer to first)
	*/
	private getOrder(tool: ITool): number {
		if (CollectionService.HasTag(tool.instance, "Weapon")) {
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
