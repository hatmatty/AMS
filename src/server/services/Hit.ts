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
			}
		}

		AddRangedHitMiddleware(sendHit);
		AddHitMiddleware(sendHit);
	}
}
