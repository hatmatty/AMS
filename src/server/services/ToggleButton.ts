import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { State } from "./ToolService";
import { CollectionService, Players } from "@rbxts/services";
import { ITool } from "server/components/Tool";
import { ToolAdded, ToolRemoved } from "./ToolService";
import { ParseInput } from "server/modules/InputParser";
import { HttpService } from "@rbxts/services";

/**
 * Hooks into ToolService's ToolAdded and ToolRemoved events and updates all of a player's tool to have updated buttons and fires a button event with informoration on the new buttons.
 */
@Service({})
export class ToggleButton implements OnInit {
	/**
	 * Connects to the ToolAdded and ToolRemoved and calls ConfigureToggleButtons with the arguments from the connections.
	 */
	onInit() {
		ToolAdded.Connect((state, parent, tool) => this.ConfigureToggleButtons(state, parent, tool));
		ToolRemoved.Connect((state, parent, tool) => this.ConfigureToggleButtons(state, parent, tool));
	}

	/**
	 *
	 * Takes in a copy of a state from the tool store in toolservice and a parent which is the name of a player and re-configures all of the BUTTON_TOGGLE attributes of the player's tools.
	 *
	 * @param state - a copy of a state from toolservice
	 * @param parent - a string that will cause an error if it does not match up to a player's username in the game
	 */
	private ConfigureToggleButtons(state: State, parent: string, tool: Tool | ITool) {
		const player = this.GetPlayerFromUserName(parent);

		if (player === undefined) {
			error("parent must be a player's username");
		}

		const playerTools = state[parent];
		if (!playerTools) {
			error(`tools for player ${parent} not found`);
		}

		if (typeIs(tool, "Instance") && tool.GetAttribute("INITED") === undefined) {
			const InputConnection = Events.Input.connect((Player, input) => {
				if (Player !== player) {
					return;
				}

				const parsedInput = ParseInput(input);

				if (parsedInput.State === "End" && parsedInput.Input === tool.GetAttribute("BUTTON_TOGGLE")) {
					// WIP -- ENABLE // DISABLE THE TOOL
				}
			});

			tool.AncestryChanged.Connect(() => {
				if (!tool.IsDescendantOf(game)) {
					InputConnection.Disconnect();
				}
			});

			tool.SetAttribute("INITED", true);
			tool.SetAttribute("timeCreated", tick());
			tool.SetAttribute("id", HttpService.GenerateGUID());
		}

		function GetAttribute(tool: Tool, attributeName: string, kind: "number" | "string"): unknown {
			const attribute = tool.GetAttribute(attributeName);
			if (attribute === undefined) {
				error(`${attributeName} has not been set`);
			}

			if (typeIs(attribute, kind)) {
				return attribute as unknown;
			} else {
				error("timeCreated is not a number");
			}
		}

		playerTools.sort((a, b) => {
			const aOrder = this.getOrder(a);
			const bOrder = this.getOrder(b);

			const aTimeCreated = typeIs(a, "Instance")
				? (GetAttribute(a, "timeCreated", "number") as number)
				: a.timeCreated;
			const bTimeCreated = typeIs(b, "Instance")
				? (GetAttribute(b, "timeCreated", "number") as number)
				: b.timeCreated;

			if (aOrder !== bOrder) {
				return aOrder > bOrder;
			} else {
				return aTimeCreated < bTimeCreated;
			}
		});

		const getNum = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

		let index = 0;
		playerTools.forEach((tool) => {
			const IsRobloxTool = typeIs(tool, "Instance");

			const Instance = IsRobloxTool ? tool : tool.instance;

			if (index > 9) {
				return warn("further adding of tools will not get any new buttons");
			}

			Instance.SetAttribute("BUTTON_TOGGLE", getNum[index]);

			const id = typeIs(tool, "Instance") ? (GetAttribute(tool, "id", "string") as string) : tool.id;

			Events.ButtonChanged(player, Instance, index + 1, id);

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
