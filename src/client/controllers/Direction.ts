import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, RunService, UserInputService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { Events } from "client/events";
import { Directions } from "shared/types";
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
	public Direction: Directions = "RIGHT";
	/** stores the amount of heartbeats the camera has moved in a direction */
	private prevX = 0;
	public DirectionChanged = new Signal<(Direction: Directions) => void>();

	onInit() {
		this.PCInit();
		this.MobileInit();
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
			let Direction: Directions | undefined;
			if (math.abs(mouse_location[index]) >= 6) {
				const isNegative = mouse_location[index] < 0 ? true : false;
				if (index === "Y") {
					if (isNegative) {
						Direction = "UP";
					} else {
						Direction = "DOWN";
					}
				} else {
					if (isNegative) {
						Direction = "LEFT";
					} else {
						Direction = "RIGHT";
					}
				}
			}

			if (Direction !== undefined && Direction !== this.Direction) {
				this.Direction = Direction;
				Events.Direction(this.Direction);
				this.DirectionChanged.Fire(this.Direction);
			}
		});
	}

	MobileInit() {
		UserInputService.TouchSwipe.Connect((swipeDirection) => {
			switch (swipeDirection) {
				case Enum.SwipeDirection.Left: {
					this.Direction = "LEFT";
					break;
				}
				case Enum.SwipeDirection.Right: {
					this.Direction = "RIGHT";
					break;
				}
				case Enum.SwipeDirection.Up: {
					this.Direction = "UP";
					break;
				}
				case Enum.SwipeDirection.Down: {
					this.Direction = "DOWN";
					break;
				}
				case Enum.SwipeDirection.None: {
					return;
				}
			}

			Events.Direction(this.Direction);
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
