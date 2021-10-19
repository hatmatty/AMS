export {};

//     "entryPointStrategy":"expand",

import { Players } from "@rbxts/services";
import { Dependency } from "@flamework/core";
import { ToolService } from "./services/ToolService";

task.defer(() => {
	const toolService = Dependency<ToolService>();

	for (const player of Players.GetPlayers()) {
		player.CharacterAdded.Connect(() => {
			toolService.addTool("Kopis", player);
			toolService.addTool("Shield", player);
		});
	}

	Players.PlayerAdded.Connect((player) => {
		player.CharacterAdded.Connect(() => {
			toolService.addTool("Kopis", player);
			toolService.addTool("Shield", player);
		});
	});
});
