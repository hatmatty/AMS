import { Controller, OnInit } from "@flamework/core";
import Roact, { Event } from "@rbxts/roact";
import { Events } from "client/events";
import Config from "shared/Config";
import { Directions } from "shared/types";
import { Players } from "@rbxts/services";
import { Arrows } from "client/modules/Arrows";
import { Janitor } from "@rbxts/janitor";
import { Direction } from "./Direction";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui");
if (!PlayerGui.IsA("PlayerGui")) {
	error();
}

@Controller({})
export class DirectionGUI implements OnInit {
	Enabled = false;
	PrevDirection?: Directions;
	GUI?: Roact.Tree;
	Janitor = new Janitor();

	constructor(private readonly Direction: Direction) {
		this.Direction = Direction;
	}

	onInit() {
		if (!Config.Elements.DirectionalArrows) {
			return;
		}

		Events.ToggleDirectionalArrows.connect((bool) => {
			if (bool) {
				this.Enable();
			} else {
				this.Disable();
			}
		});

		Player.CharacterRemoving.Connect(() => {
			if (this.GUI) {
				this.Disable();
			}
		});
	}

	Enable() {
		if (this.GUI) {
			error("Attempting to enable when already enabled.");
		}

		this.GUI = Roact.mount(
			Roact.createElement(Arrows, { direction: this.Direction.Direction, prevDirection: this.PrevDirection }),
			PlayerGui,
			"DirectionalArrows",
		);

		this.PrevDirection = this.Direction.Direction;

		this.Janitor.Add(
			this.Direction.DirectionChanged.Connect((direction) => {
				if (!this.GUI) {
					error("Attempting to update when disabled.");
				}
				Roact.update(
					this.GUI,
					Roact.createElement(Arrows, { direction: direction, prevDirection: this.PrevDirection }),
				);
				this.PrevDirection = direction;
			}),
		);
	}

	Disable() {
		if (!this.GUI) {
			error("Attempting to disable when already disabled.");
		}
		this.PrevDirection = undefined;
		this.Janitor.Cleanup();
		Roact.unmount(this.GUI);
		this.GUI = undefined;
	}
}
