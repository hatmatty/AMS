import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { Players } from "@rbxts/services";

/**
 * Serves to replicate body rotation from the client to other clients by having the client send their joint CFrame info through a server event and then have that info sent to other clients within a distance of them back through a client event.
 */
@Service()
export class Rotation implements OnInit {
	/**
	 * Hooks the UpdateRotation method to the UpdateRotation server event.
	 */
	onInit() {
		Events.UpdateRotation.connect(
			(player: Player, waist: CFrame, neck: CFrame, leftshoulder: CFrame, rightshoulder: CFrame) => {
				Rotation.UpdateRotation(player, waist, neck, leftshoulder, rightshoulder);
			},
		);
	}

	/**
	 * Takes in a player and their joint cframes and fires an UpdateRotation client event to everyone within a certain distance of that player so that the player's body rotation will replicate.
	 */
	private static UpdateRotation(
		player: Player,
		waist: CFrame,
		neck: CFrame,
		leftshoulder: CFrame,
		rightshoulder: CFrame,
	) {
		const character = player.Character;
		if (!character) {
			error("character needed");
		}

		Events.UpdateRotation.fire(
			Rotation.GetPlayersWithinDist(player, 20),
			player,
			waist,
			neck,
			leftshoulder,
			rightshoulder,
		);
	}

	/**
	 * @returns players that are within the distance passed in of the player passed in.
	 */
	private static GetPlayersWithinDist(player: Player, distance: number): Player[] {
		const character = player.Character;
		if (!character) {
			error("character needed");
		}
		const root = character.FindFirstChild("HumanoidRootPart");
		if (!root || !root.IsA("BasePart")) {
			error("root needed");
		}

		const players: Player[] = [];

		for (const Player of Players.GetPlayers()) {
			if (Player === player) {
				continue;
			} else if (Player.Character) {
				const otherRoot = Player.Character.FindFirstChild("HumanoidRootPart");
				if (otherRoot && otherRoot.IsA("BasePart")) {
					if (root.Position.sub(otherRoot.Position).Magnitude <= distance) {
						players.push(Player);
					}
				}
			}
		}

		return players;
	}

	/** @ignore */
	constructor() {}
}
