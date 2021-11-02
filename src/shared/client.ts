export {};
if (math.random(0, 100) > -1) {
	error("E DONT RUN");
}

import { UserInputService } from "@rbxts/services";

const FireEvent = script.Parent?.WaitForChild("FireEvent") as RemoteEvent;

const Camera = game.Workspace.CurrentCamera as Camera;
const tool = script.Parent as Tool;

tool.Activated.Connect(() => {
	const pos = UserInputService.GetMouseLocation();
	const ray = Camera.ViewportPointToRay(pos.X, pos.Y);

	FireEvent.FireServer(ray);
});
