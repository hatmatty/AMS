import { Service, OnInit } from "@flamework/core";
import { AddBlockedMiddleware } from "server/components/Shield";
import { AddHitMiddleware } from "server/components/Weapon";
import { playAnim } from "server/modules/AnimPlayer";
import Config from "shared/Config";

const BlockedStunTime = 0.4;

/**
 * Attaches to the blocked middleware and stuns the player who is blocked.
 */
@Service({})
export class Stun implements OnInit {
	onInit() {
		if (Config.Elements.Stuns) {
			AddHitMiddleware((stop, weapon, hit) => {});

			AddBlockedMiddleware((stop, weapon, shield) => {
				const Player = weapon.Player;
				if (!Player) {
					error();
				}
				this.Stun(Player, weapon.Direction);

				const Connection = weapon.Actions.Release.Ended.Connect(() => {
					Connection.Disconnect();
					print(weapon.state);
					weapon.setState("Stunned");

					Promise.delay(BlockedStunTime).then(() => {
						print("released");
						weapon.setState("Enabled");
					});
				});
			});
		}
	}

	Stun(Player: Player, Direction: string) {
		let animation: number;
		switch (Direction) {
			case "LEFT": {
				animation = Config.Animations.Stunned.Left;
				break;
			}
			case "RIGHT": {
				animation = Config.Animations.Stunned.Right;
				break;
			}
			case "STAB": {
				animation = Config.Animations.Stunned.Stab;
				break;
			}
			default: {
				error(`Implement animation for direction: ${Direction}`);
			}
		}
		playAnim(Player, animation);
	}
}
