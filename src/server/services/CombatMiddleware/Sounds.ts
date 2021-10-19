import { Service, OnInit } from "@flamework/core";
import { AddBlockedMiddleware } from "server/components/Shield";
import { AddHitMiddleware, AddSwingMiddleware } from "server/components/Weapon";
import Config from "shared/Config";
import { ReplicatedStorage } from "@rbxts/services";

@Service({})
export class Sounds implements OnInit {
	onInit() {
		if (Config.Elements.Sounds) {
			AddHitMiddleware((stop, weapon, hit) => {
				if (hit.IsA("Player")) {
					this.PlaySound(weapon.instance.DmgPart, "Hit");
				}
			});

			AddBlockedMiddleware((stop, weapon, shield) => {
				this.PlaySound(weapon.instance.DmgPart, "Blocked");
			});

			AddSwingMiddleware((stop, weapon) => {
				this.PlaySound(weapon.instance.DmgPart, "Swing");
			});
		}
	}

	PlaySound(part: BasePart, soundType: "Hit" | "Swing" | "Blocked") {
		const Sounds = ReplicatedStorage.Assets.Sounds[soundType].GetChildren();
		const Sound = Sounds[math.random(0, Sounds.size() - 1)].Clone();
		if (!Sound.IsA("Sound")) {
			error();
		}
		Sound.Parent = part;
		Sound.Play();
		Promise.delay(Sound.TimeLength).then(() => {
			Sound.Destroy();
		});
	}
}
