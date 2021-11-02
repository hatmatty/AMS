import { Controller, OnStart, OnInit } from "@flamework/core";
import { Events } from "client/events";
import { UserInputService } from "@rbxts/services";

const Camera = game.Workspace.CurrentCamera;

@Controller({})
export class Ray implements OnInit {
	onInit() {
		task.defer(() => {
			while (true) {
				task.wait(0.1);

				let pos;

				if (!Camera) {
					error("");
				}

				if (UserInputService.MouseEnabled) {
					pos = UserInputService.GetMouseLocation();
				} else {
					const ViewportSize = Camera.ViewportSize;
					pos = new Vector2(ViewportSize.X / 2, ViewportSize.Y / 2);
				}

				Events.MouseRay(Camera.ViewportPointToRay(pos.X, pos.Y));
			}
		});
	}
}
