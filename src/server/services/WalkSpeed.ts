import { Service, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import Config from "shared/Config";
@Service({})
export class Walkspeed implements OnInit {
	onInit() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				const Humanoid = character.WaitForChild("Humanoid");
				if (!Humanoid.IsA("Humanoid")) {
					error();
				}
				Humanoid.WalkSpeed = Config.Attributes.WalkSpeed;
			});
		});
	}
}
