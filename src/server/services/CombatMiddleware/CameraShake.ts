import { AddBlockedMiddleware } from "server/components/Shield";
import { AddSwingMiddleware, AddHitMiddleware } from "server/components/Weapon";
import { Events } from "server/events";

import { Service, OnInit } from "@flamework/core";
import Config from "shared/Config";

@Service({})
export class CameraShake implements OnInit {
	onInit() {
		if (Config.Elements.CameraShake) {
			AddBlockedMiddleware((stop, weapon, shield) => {
				if (!weapon.Player) {
					error();
				}

				if (!shield.Player) {
					error();
				}

				Events.AttackStatus(shield.Player, "GAVE_BLOCK");
				Events.AttackStatus(weapon.Player, "GOT_BLOCK");
			});

			AddSwingMiddleware((stop, weapon) => {
				if (!weapon.Player) {
					error();
				}

				Events.AttackStatus(weapon.Player, "SWUNG");
			});

			AddHitMiddleware((stop, weapon, hit, db) => {
				if (!weapon.Player) {
					error();
				}

				if (hit.IsA("Player")) {
					Events.AttackStatus(weapon.Player, "HIT");
					Events.AttackStatus(hit, "DAMAGED");
				}
			});
		}
	}
}
