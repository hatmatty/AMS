import { Events } from "client/events";
import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { Ranged } from "client/modules/Ranged";
import { UserInputService } from "@rbxts/services";
import { Rotation } from "./Rotation";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui");
if (!PlayerGui.IsA("PlayerGui")) {
	error("PlayerGui is not a PlayerGui");
}

@Controller({})
export class RangedGUI implements OnInit {
	Enabled = false;
	prevPercentage = 0;
	GUI?: Roact.Tree;
	ReturnToValue: number;
	RotationController: Rotation;

	constructor(rotation: Rotation) {
		this.RotationController = rotation;
		this.ReturnToValue = rotation.ClampValue;
	}

	onInit() {
		Events.ToggleRangedGUI.connect((state) => {
			this.Toggle(state);
		});

		Events.UpdateRangedGUI.connect((percentage) => this.Update(percentage));
	}

	Toggle(state: boolean) {
		if (state === this.Enabled) {
			return warn("toggling to the same state");
		}

		this.Enabled = state;

		if (state) {
			if (this.GUI) {
				return warn("GUI already exists");
			}
			this.GUI = Roact.mount(Roact.createElement(Ranged, { prevPercentage: 0, percentage: 0 }), PlayerGui);
			this.RotationController.ClampValue = 0.05;
		} else {
			if (!this.GUI) {
				return warn("attempting to unmount an empty tree!");
			}
			Roact.unmount(this.GUI);
			this.GUI = undefined;
			this.RotationController.ClampValue = this.ReturnToValue;
		}
	}

	Update(percentage: number) {
		if (!this.Enabled) {
			return warn("updating when not enabled!");
		}

		if (!this.GUI) {
			return warn("attempting to update a nil tree");
		}

		if (percentage < 0 || percentage > 1) {
			error(`percentage must be between 0 and 1 - got: ${percentage}`);
		}

		Roact.update(
			this.GUI,
			Roact.createElement(Ranged, { prevPercentage: this.prevPercentage, percentage: percentage }),
		);
		this.prevPercentage = percentage;
	}
}
