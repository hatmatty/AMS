import { Controller, OnStart, OnInit } from "@flamework/core";
import { StarterGui } from "@rbxts/services";

@Controller({})
export class ToolGui implements OnInit {
	onInit() {
		StarterGui.SetCoreGuiEnabled("Backpack", false);
	}
}
