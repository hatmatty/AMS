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
	public CamShaker = new CameraShaker(Enum.RenderPriority.Camera.Value, (shakeCFrame) => {
		if (!Camera) {
			error(`player camera for ${Players.LocalPlayer.Name} not found`);
		}
		Camera.CFrame = Camera.CFrame.mul(shakeCFrame);
	});

	onInit() {
		if (Config.Elements.DisableCameraShake) {
			return;
		}

		this.CamShaker.Start();

		Events.AttackStatus.connect((status) => {
			switch (status) {
				case "GAVE_BLOCK": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "GOT_BLOCK": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "DAMAGED": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "GOT_SHOT": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "GAVE_SHOT": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "RELEASED_SHOT": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "HIT": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
				}
				case "SWUNG": {
					return this.CamShaker.Shake(CameraShaker.Presets.Bump);
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
