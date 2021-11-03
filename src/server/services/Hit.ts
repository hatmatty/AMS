import { Service, OnInit } from "@flamework/core";
import { AddRangedHitMiddleware } from "server/components/Bow";
import { AddHitMiddleware, Weapon } from "server/components/Weapon";
import { Events } from "server/events";
import { Bow } from "server/components/Bow";

@Service({})
export class Hit implements OnInit {
	onInit() {
		function sendHit(stop: Callback, tool: Weapon | Bow, instance: Instance) {
			if (!tool.Player) {
				return;
			}

			if (instance.IsA("Player")) {
				Events.Hit(tool.Player, tool.Damage);
				print(`Sent ${tool.Damage} damage hit to ${tool.Player}`);
			}
		}

		AddRangedHitMiddleware(sendHit);
		AddHitMiddleware(sendHit);
	}
}
