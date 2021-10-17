import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { ToolService, State } from "./ToolService";
import { CollectionService, Players } from "@rbxts/services";
import { ITool } from "server/components/Tool";
import { ToolAdded, ToolRemoved } from "./ToolService";

@Service({})
export class ToggleButton implements OnInit {
	onInit() {
		ToolAdded.Connect((store, parent) => this.ConfigureToggleButtons(store, parent));
		ToolRemoved.Connect((store, parent) => this.ConfigureToggleButtons(store, parent));
	}

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

	private getOrder(tool: ITool): number {
		if (CollectionService.HasTag(tool.instance, "Weapon")) {
			return 1;
		}
		return 0;
	}

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
