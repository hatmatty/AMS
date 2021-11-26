import { Components } from "@flamework/components";
import { Service, OnInit, Dependency } from "@flamework/core";
import { Essential } from "server/components/Essential";
import { AddBlockedMiddleware } from "server/components/Shield";
import { Spear } from "server/components/Spear";
import { Sword } from "server/components/Sword";
import { AddHitMiddleware, Weapon } from "server/components/Weapon";
import { Events } from "server/events";
import { playAnim } from "server/modules/AnimPlayer";
import { CancelAttack, IsAttacking, TryCancelWeapon } from "server/modules/CancelWeapon";
import Config from "shared/Config";

const components = Dependency<Components>();
const BlockedStunTime = 0.65;
const RegularStunTime = 0.3;

/**
 * Attaches to the blocked middleware and stuns the player who is blocked.
 */
@Service({})
export class Stun implements OnInit {
	onInit() {
		if (Config.Elements.StunOnHit) {
			AddHitMiddleware((stop, hitterWeapon, hit) => {
				if (hit.IsA("Player")) {
					const Character = hit.Character as Model;

					for (const child of Character.GetChildren()) {
						if (child.IsA("Model") && child.FindFirstChild("DmgPart")) {
							// @ts-expect-error im checking
							const weapon = Weapon.Weapons.get(child);
							if (!weapon) {
								continue;
							}

							if (weapon) {
								if (weapon.state === "Disabled") {
									continue;
								} else if (weapon.state === "Stunned") {
									return; // already stunned
								} else if (IsAttacking(weapon) || weapon.state === "Enabled") {
									weapon.ShouldEnableArrows = false;

									if (weapon.state === "Enabled") {
										Events.ToggleDirectionalArrows(hit, false);
									} else if (IsAttacking(weapon)) {
										CancelAttack(weapon);
									}

									weapon.setState("Stunned");
									Promise.delay(RegularStunTime - 0.05).then(() => {
										Events.ToggleDirectionalArrows(hit, true);
										Promise.delay(0.05).then(() => {
											weapon.setState("Enabled");
										});
									});
								}
							}
						}
					}

					this.Stun(hit, hitterWeapon.SetDirection, RegularStunTime);
				}
			});
		}

		if (Config.Elements.StunOnBlock) {
			AddBlockedMiddleware((stop, weapon, shield) => {
				const Player = weapon.Player;
				if (!Player) {
					error();
				}
				weapon.ShouldEnableArrows = false;
				this.Stun(Player, weapon.SetDirection, BlockedStunTime);

				const Connection = weapon.Actions.Release.Ended.Connect(() => {
					Connection.Disconnect();
					weapon.setState("Stunned");

					Promise.delay(BlockedStunTime - 0.2).then(() => {
						Events.ToggleDirectionalArrows(Player, true);
						Promise.delay(0.2).then(() => {
							weapon.setState("Enabled");
						});
					});
				});
			});
		}
	}

	Stun(Player: Player, Direction: string, duration: number) {
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
			case "DOWN": {
				animation = Config.Animations.Stunned.Stab;
				break;
			}
			case "UP": {
				animation = Config.Animations.Stunned.Stab;
				break;
			}
			default: {
				error(`Implement animation for direction: ${Direction}`);
			}
		}
		const StunAnim = playAnim(Player, animation);
		const AnimLength = 0.63333332538605;
		task.defer(() => {
			if (duration >= AnimLength) {
				StunAnim.AdjustSpeed((AnimLength - 0.1) / duration);

				const connection = StunAnim.Stopped.Connect(() => {
					StunAnim.Destroy();
					connection.Disconnect();
				});
			} else {
				task.wait(duration);
				StunAnim.Stop(0.2);
				StunAnim.Destroy();
			}
		});
	}
}
