import { Controller, OnStart, OnInit } from "@flamework/core";
import { StarterGui, Players, HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { Events } from "client/events";
import { Indicator } from "../modules/Indicator";
import Object from "@rbxts/object-utils";
const Image = "rbxasset://textures/ui/TopBar/WhiteOverlayAsset.png";
const BlockColor = new Color3(255, 255, 255);
const BloodColor = new Color3(150, 0, 0);
const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
if (!PlayerGui.IsA("PlayerGui")) {
	error("");
}

@Controller({})
export class Indicators implements OnInit {
	onInit() {
		Events.AttackStatus.connect((status) => {
			if (status === "GOT_BLOCK" || status === "GAVE_BLOCK") {
				this.create(BlockColor);
			}
		});
	}

	create(color: Color3) {
		const GUI = Roact.mount(Roact.createElement(Indicator, { image: Image, color: color }), PlayerGui);
		task.spawn(() => {
			task.wait(0.2);
			Roact.unmount(GUI);
		});
	}
}
