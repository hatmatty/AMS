import { Service, OnInit } from "@flamework/core";
import { Init, ExploiterCaught, SetFirstTimeWait, SetInvokeTimeout } from "@rbxts/securehitbox";
import { Events } from "server/events";
import { Players } from "@rbxts/services";

@Service({})
export class Checker implements OnInit {
	onInit() {
		SetFirstTimeWait(60);
		SetInvokeTimeout(30);
		ExploiterCaught.Event.Connect((player) => {
			Events.DisplayMessage(Players.GetPlayers(), `${player.Name} has been caught exploiting.`);
		});
		Init();
	}
}

typeIs(new Vector2(1, 0), "Vector2");
