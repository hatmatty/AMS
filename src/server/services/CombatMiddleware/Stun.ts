import { Components } from "@flamework/components";
import { Service, OnInit, Dependency } from "@flamework/core";
import { Essential } from "server/components/Essential";
import { AddBlockedMiddleware } from "server/components/Shield";
import { Spear } from "server/components/Spear";
import { Sword } from "server/components/Sword";
import { AddHitMiddleware, Weapon } from "server/components/Weapon";
import { playAnim } from "server/modules/AnimPlayer";
import Config from "shared/Config";

const components = Dependency<Components>();
const BlockedStunTime = 0.8;
const RegularStunTime = 0.3;

/**
 * Attaches to the blocked middleware and stuns the player who is blocked.
 */
@Service({})
export class Stun implements OnInit {
	onInit() {
		if (Config.Elements.StunOnHit) {
			AddHitMiddleware((stop, weapon, hit) => {
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
								} else if (
									weapon.state === "Drawing" ||
									weapon.state === "Releasing" ||
									weapon.state === "Enabled"
								) {
									if (weapon.state === "Drawing") {
										if (weapon.Actions.Draw.Status !== "STARTED") {
											warn(`${weapon} state is drawing but status for draw is not started.`);
											continue;
										}
										weapon.Actions.Draw.End();
									}
									if (weapon.state === "Releasing") {
										if (weapon.Actions.Release.Status !== "STARTED") {
											warn(`${weapon} state is releasing but status for release is not started.`);
											continue;
										}
										weapon.Actions.Release.End();
									}
									const ActiveAnimation = weapon.ActiveAnimation as AnimationTrack | undefined;
									if (ActiveAnimation) {
										ActiveAnimation.Stop();
									}
									weapon.setState("Stunned");
									Promise.delay(RegularStunTime).then(() => {
										weapon.setState("Enabled");
									});
								}
							}
						}
					}

					this.Stun(hit, weapon.SetDirection);
				}
			});
		}

		if (Config.Elements.StunOnBlock) {
			AddBlockedMiddleware((stop, weapon, shield) => {
				const Player = weapon.Player;
				if (!Player) {
					error();
				}
				this.Stun(Player, weapon.SetDirection);

				const Connection = weapon.Actions.Release.Ended.Connect(() => {
					Connection.Disconnect();
					weapon.setState("Stunned");

					Promise.delay(BlockedStunTime).then(() => {
						weapon.setState("Enabled");
					});
				});
			});
		}
	}

	Stun(Player: Player, Direction: string, time = BlockedStunTime) {
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
		playAnim(Player, animation);
	}
}
