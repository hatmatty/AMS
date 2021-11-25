import Object from "@rbxts/object-utils";
import { Equipped, EquippedChanged, GetEquippedCount } from "client/modules/Equipped";

import { Controller, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";
import { Players, RunService, TweenService } from "@rbxts/services";

const Info = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
const Player = Players.LocalPlayer;
const Camera = game.Workspace.CurrentCamera;

@Controller({})
export class HigherCamera implements OnInit {
	FirstPersonEnabled = false;

	onInit() {
		if (!Config.Elements.DisableSpringCamera) {
			return;
		}
		if (!Config.Elements.HigherCamera) {
			return;
		}

		RunService.Heartbeat.Connect(() => {
			if (!Player.Character || !Player.HasAppearanceLoaded()) {
				return;
			}
			const Head = this.GetHead();

			if (!Camera) {
				error("Could not find current camera in the workspace.");
			}

			if (Head.LocalTransparencyModifier === 1) {
				this.Disable();
			} else {
				this.Update();
			}
		});
	}

	Update(): void {
		if (GetEquippedCount() > 0) {
			this.Enable();
		} else {
			this.Disable();
		}
	}

	GetCharacter(): Model {
		const Char = Player.Character;
		if (Char) {
			return Char;
		} else {
			error("Could not get character.");
		}
	}

	GetHumanoid(): Humanoid {
		const Char = this.GetCharacter();
		const Humanoid = Char.FindFirstChildOfClass("Humanoid");
		if (Humanoid) {
			return Humanoid;
		} else {
			error("Could not find humanoid.");
		}
	}

	GetHead(): BasePart {
		const Char = this.GetCharacter();
		const Head = Char.FindFirstChild("Head");
		if (Head && Head.IsA("BasePart")) {
			return Head;
		} else {
			error("Could not find head.");
		}
	}

	Enable() {
		const Humanoid = this.GetHumanoid();
		TweenService.Create(Humanoid, Info, { CameraOffset: Config.Attributes.CameraOffset }).Play();
	}

	Disable() {
		const Humanoid = this.GetHumanoid();
		TweenService.Create(Humanoid, Info, { CameraOffset: new Vector3(0, 0, 0) }).Play();
	}
}
