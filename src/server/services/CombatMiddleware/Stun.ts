import { Components } from "@flamework/components";
import { Service, OnInit, Dependency } from "@flamework/core";
import { AddBlockedMiddleware } from "server/components/Shield";
import { Spear } from "server/components/Spear";
import { Sword } from "server/components/Sword";
import { AddHitMiddleware, Weapon } from "server/components/Weapon";
import { playAnim } from "server/modules/AnimPlayer";
import Config from "shared/Config";

const components = Dependency<Components>();
const BlockedStunTime = 0.8;
const RegularStunTime = 0.2;

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
						if (child.IsA("Model")) {
							// @ts-expect-error im checking
							const toolType = Config.Tools[child.Name] as string | undefined;
							if (toolType !== undefined) {
								let weapon: Weapon | undefined;
								if (toolType === "Sword") {
									weapon = components.getComponent<Sword>(child);
								} else if (toolType === "Spear") {
									weapon = components.getComponent<Spear>(child);
								} else if (toolType === "Javelin") {
									weapon = components.getComponent<Spear>(child);
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
											weapon.Actions.Draw.End();
										} else if (weapon.state === "Releasing") {
											weapon.Actions.Release.End();
										}
										weapon.ActiveAnimation?.Stop();
										weapon.setState("Stunned");

										Promise.delay(BlockedStunTime / 2).then(() => {
											weapon?.setState("Enabled");
										});
									}
								}
							}
						}
					}

					this.Stun(hit, weapon.Direction);
				}
			});
		}

		if (Config.Elements.StunOnBlock) {
			AddBlockedMiddleware((stop, weapon, shield) => {
				const Player = weapon.Player;
				if (!Player) {
					error();
				}
				this.Stun(Player, weapon.Direction);

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
