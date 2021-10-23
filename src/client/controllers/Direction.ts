import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, RunService, UserInputService } from "@rbxts/services";
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
		this.PCInit();
	}

	PCInit() {
		let mouse_location: Vector2;
		let prev_mouse_location = UserInputService.GetMouseLocation();
		const failed = new Vector2(0, 0);

		RunService.RenderStepped.Connect(() => {
			const new_location = UserInputService.GetMouseDelta();
			if (new_location === failed) {
				mouse_location = UserInputService.GetMouseLocation().sub(prev_mouse_location);
				prev_mouse_location = UserInputService.GetMouseLocation();
			} else {
				mouse_location = new_location;
			}

			const index = this.GetIndexofAbsoluteLargest(mouse_location);
			let Direction: string | undefined;
			if (math.abs(mouse_location[index]) > 5) {
				const isNegative = mouse_location[index] < 0 ? true : false;
				if (index === "Y") {
					if (isNegative) {
						Direction = "DOWN";
					} else {
						Direction = "UP";
					}
				} else {
					if (isNegative) {
						// Direction = "LEFT";
					} else {
						// Direction = "RIGHT";
					}
				}
			}

			if (Direction !== undefined && Direction !== this.Direction) {
				this.Direction = Direction as "UP";
				print(Direction);
				Events.Direction(this.Direction);
			}
		});
	}

	MobileInit() {
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

	GetIndexofAbsoluteLargest(vec2: Vector2): "X" | "Y" {
		if (math.abs(vec2.X) > math.abs(vec2.Y)) {
			return "X";
		} else {
			return "Y";
		}
	}

	/** @ignore */
	constructor() {}
}
