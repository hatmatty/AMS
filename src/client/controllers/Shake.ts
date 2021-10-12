// TOGGLEABLE ELEMENT

import { Controller, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";
import CameraShaker from "@rbxts/camera-shaker";
import { Events } from "client/events";
import { Players } from "@rbxts/services";

const Camera = game.Workspace.CurrentCamera;

/**
 * Listens to attack status signals (when the player swing theirs sword, hits a player, gets damaged, etc) then applies a camera shake effect accordingly.
 */
@Controller()
export class Shake implements OnInit {
	private CameraShaker = new CameraShaker(100, (shakeCFrame) => {
		if (!Camera) {
			error(`player camera for ${Players.LocalPlayer.Name} not found`);
		}
		Camera.CFrame = Camera.CFrame.mul(shakeCFrame);
	});

	onInit() {
		if (!Config.Elements.CameraShake) {
			return;
		}

		Events.AttackStatus.connect((status) => {
			switch (status) {
				case "BLOCKED": {
					this.CameraShaker.Shake(CameraShaker.Presets.Bump);
					return this.CameraShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "DAMAGED": {
					this.CameraShaker.Shake(CameraShaker.Presets.Bump);
					return this.CameraShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "HIT": {
					return this.CameraShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "SWUNG": {
					return this.CameraShaker.Shake(CameraShaker.Presets.Bump);
				}
				default: {
					const _exhaustiveCheck: never = status;
					error(`exhaustive check failed!, got status: ${status}`);
				}
			}
		});
	}

	/** @ignore */
	constructor() {}
}
