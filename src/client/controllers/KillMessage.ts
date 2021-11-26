import { KillTag } from "client/modules/KillTag";

import { Controller, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";
import { Events } from "client/events";
import { Players } from "@rbxts/services";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui");
if (!PlayerGui.IsA("PlayerGui")) {
	error("");
}

@Controller({})
export class KillMessage implements OnInit {
	Tag?: Roact.Tree;

	onInit() {
		Events.Killed.connect((playerName) => {
			if (this.Tag) {
				Roact.unmount(this.Tag);
			}

			this.Tag = Roact.mount(Roact.createElement(KillTag, { playerName: playerName }), PlayerGui, "KillTag");
		});
	}
}
