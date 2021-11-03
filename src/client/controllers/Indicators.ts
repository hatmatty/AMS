import { Controller, OnStart, OnInit } from "@flamework/core";
import { StarterGui, Players, HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { Events } from "client/events";
import { Indicator } from "../modules/Indicator";

import Object from "@rbxts/object-utils";

const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
if (!Player.Gui.IsA("PlayerGui") { error("") }

@Controller({})
export class Indicators implements OnInit {
	onInit() {
		
	}
}
