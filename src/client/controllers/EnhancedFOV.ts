import { Controller, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";
import { RunService, Players } from "@rbxts/services";
const Camera = game.Workspace.CurrentCamera;

@Controller({})
export class EnhancedFOV implements OnInit {
	onInit() {
		if (!Config.Elements.EnhancedFOV) {
			return;
		}
		if (!Camera) {
			error("Could not find current camera under workspace.");
		}
		Camera.FieldOfView = 80;
	}
}
