import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, RunService } from "@rbxts/services";
import { Events } from "client/events";
const Camera = game.Workspace.CurrentCamera;

/**
 *
 * Manages the sending of what direction the player is facing (either "UP" or "DOWN") to the server thorugh the Direction event.
 *
 *
 * @example
 *
 * ```
 * WRITTEN: player rotates their camera up, fast enough to trigger the "if (this.prevX !== x && math.abs(this.prevX - x) >= 0.02)" to evaluate to true which sets the direction to "UP" and fires the direction event with the direction.
 * ```
 *
 * @category Required
 */
@Controller()
export class Direction implements OnInit {
	/** stores the direction the player's camera is facing in */
	private Direction: "DOWN" | "UP" = "DOWN";
	/** stores the amount of heartbeats the camera has moved in a direction */
	private prevX = 0;

	onInit() {
		if (!Camera) {
			error(`player camera for ${Players.LocalPlayer.Name} not found`);
		}

		RunService.Heartbeat.Connect(() => {
			const [x] = Camera.CFrame.ToOrientation();

			if (this.prevX !== x && math.abs(this.prevX - x) >= 0.02) {
				const currentDirection = this.prevX < x ? "DOWN" : "UP";

				if (currentDirection !== this.Direction) {
					// moving in different direction
					this.Direction = currentDirection;
					Events.Direction(this.Direction);
				}
			}

			this.prevX = x;
		});
	}

	/** @ignore */
	constructor() {}
}
