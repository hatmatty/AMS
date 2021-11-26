import { Service, OnInit } from "@flamework/core";
import { AddHitMiddleware, Weapon } from "server/components/Weapon";
import { Events } from "server/events";
import { AddRangedHitMiddleware, Ranged } from "server/modules/RangedUtil";

@Service({})
export class Hit implements OnInit {
	onInit() {
		function sendHit(stop: Callback, tool: Weapon | Ranged, instance: Instance) {
			if (!tool.Player) {
				return;
			}

			if (instance.IsA("Player")) {
				Events.Hit(tool.Player, tool.Damage);
				if (instance.Character) {
					const Humanoid = instance.Character.FindFirstChildOfClass("Humanoid");
					if (!Humanoid || Humanoid.Health <= 0) {
						return;
					}
					if (Humanoid.Health - tool.Damage <= 0) {
						Events.Killed(tool.Player, instance.DisplayName);
					}
				}
			}
		}

		AddRangedHitMiddleware(sendHit);
		AddHitMiddleware(sendHit);
	}
}
