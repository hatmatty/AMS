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
 * WRITTEN: player rotates their camera up, fast enough to trigger the "if (this.prevX !== x && math.abs(this.prevX - x) >= 0.02)" to evaluate to true and does this for long enough to add enough beats so the "if (this.beats > 2)" evaluates to true and the direction changes to "UP" and the beats are reset to 0.
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
	/** stores the previous X position of the player camera */
	private beats = 0;

	onInit() {
		Events.Direction(this.Direction);
		if (!Camera) {
			error(`player camera for ${Players.LocalPlayer.Name} not found`);
		}
		const [x] = Camera.CFrame.ToEulerAnglesXYZ();
		this.prevX = x;

		RunService.Heartbeat.Connect(() => {
			const [x] = Camera.CFrame.ToEulerAnglesXYZ();

			if (this.prevX !== x && math.abs(this.prevX - x) >= 0.02) {
				const currentDirection = this.prevX < x ? "DOWN" : "UP";

				if (currentDirection !== this.Direction) {
					// moving in different direction
					this.beats += 1;
					if (this.beats > 2) {
						this.beats = 0;
						this.Direction = currentDirection;
						Events.Direction(this.Direction);
					}
				} else {
					// moving in same direction
					this.beats = math.max(0, this.beats - 1);
				}
			}
		});
	}

	/** @ignore */
	constructor() {}
}
