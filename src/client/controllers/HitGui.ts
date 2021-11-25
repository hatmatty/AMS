import { Controller, OnStart, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";
import { HitDisplay } from "client/modules/HitDisplay";
import { Players } from "@rbxts/services";
import { Events } from "client/events";
import { Init } from "@rbxts/securehitbox";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui");
if (!PlayerGui.IsA("PlayerGui")) {
	error("could not get playergui");
}

@Controller({})
export class HitGui implements OnInit {
	GUI = Roact.mount(Roact.createElement("ScreenGui"), PlayerGui, "HitDisplay");
	Inited = false;
	onInit() {
		Init();
		Events.Hit.connect((damage) => {
			this.SendHit(damage);
		});
	}

	SendHit(damage: number) {
		Roact.unmount(this.GUI);
		this.GUI = Roact.mount(
			Roact.createElement(HitDisplay, { damage: math.round(damage) }),
			PlayerGui,
			"HitDisplay",
		);
	}
}
