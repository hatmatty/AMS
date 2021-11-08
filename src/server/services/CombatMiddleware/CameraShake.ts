import { AddBlockedMiddleware } from "server/components/Shield";
import { AddSwingMiddleware, AddHitMiddleware } from "server/components/Weapon";
import { Events } from "server/events";
import { Players } from "@rbxts/services";

import { Service, OnInit } from "@flamework/core";
import Config from "shared/Config";
import {
	AddRangedReleasedMiddleware,
	AddRangedHitMiddleware,
	AddRangedDrawMiddleware,
} from "server/modules/RangedUtil";

/**
 * Attaches to the Blocked, Swing, and Hit middleware and calls a camershake upon these events.
 */
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

			AddRangedReleasedMiddleware((stop, weapon) => {
				if (!weapon.Player) {
					error();
				}

				Events.AttackStatus(weapon.Player, "RELEASED_SHOT");
			});

			AddRangedHitMiddleware((stop, weapon, hit) => {
				if (!weapon.Player) {
					error();
				}

				if (hit.IsA("Player")) {
					Events.AttackStatus(weapon.Player, "GAVE_SHOT");
					Events.AttackStatus(hit, "GOT_SHOT");
				} else if (hit.IsA("BasePart") && hit.Name === "Blocker") {
					const Character = hit.Parent?.Parent;
					if (!Character) {
						error();
					}
					const Player = Players.GetPlayerFromCharacter(Character);
					if (!Player) {
						error();
					}
					Events.AttackStatus(Player, "GAVE_BLOCK");
					Events.AttackStatus(weapon.Player, "GOT_BLOCK");
				}
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
