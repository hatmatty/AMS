import { Service, OnInit } from "@flamework/core";
import { AddBlockedMiddleware } from "server/components/Shield";
import { AddHitMiddleware, AddSwingMiddleware } from "server/components/Weapon";
import Config from "shared/Config";
import { ReplicatedStorage } from "@rbxts/services";
import {
	AddRangedDrawMiddleware,
	AddRangedHitMiddleware,
	AddRangedReleasedMiddleware,
} from "server/modules/RangedUtil";

/**
 * Attaches to the hit, blocked, and swing middlewares and plays a sound on these events.
 */
@Service({})
export class Sounds implements OnInit {
	onInit() {
		if (Config.Elements.Sounds) {
			AddHitMiddleware((stop, weapon, hit) => {
				if (hit.IsA("Player")) {
					this.PlaySound(weapon.instance.DmgPart, "Hit");
				}
			});

			AddRangedHitMiddleware((stop, weapon, hit, instance, specificLimb) => {
				if (hit.IsA("Player")) {
					if (specificLimb !== undefined) {
						this.PlaySound(specificLimb, "Hit");
					}
				} else if (hit.IsA("BasePart") && hit.Name === "Blocker") {
					this.PlaySound(hit, "Blocked");
				}
			});

			AddRangedDrawMiddleware((stop, rangedTool) => {
				if (rangedTool.className === "Spear") {
					return;
				} else {
					this.PlaySound(rangedTool.MainPart, "BowDraw");
				}
			});

			AddRangedReleasedMiddleware((stop, rangedTool) => {
				if (rangedTool.className === "Spear") {
					this.PlaySound(rangedTool.MainPart, "Swing");
				} else {
					this.PlaySound(rangedTool.MainPart, "BowFire");
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

	PlaySound(part: BasePart, soundType: keyof ReplicatedStorage["AMS-assets"]["Sounds"]) {
		const SoundFolder = ReplicatedStorage["AMS-assets"].Sounds[soundType] as Folder;
		const Sounds = SoundFolder.GetChildren();
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
