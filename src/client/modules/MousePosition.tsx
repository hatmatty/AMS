import Roact from "@rbxts/roact";
import { UserInputService, RunService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

export abstract class MousePos<P extends {}, S extends { position: UDim2 }> extends Roact.Component<P, S> {
	janitor = new Janitor();

	constructor(props: P) {
		super(props);
		this.updatePosition();
	}

	updatePosition() {
		if (!UserInputService.MouseEnabled) {
			this.setState({ position: UDim2.fromScale(0.5, 0.5) });
		} else {
			const Pos = UserInputService.GetMouseLocation();
			this.setState({ position: UDim2.fromOffset(Pos.X, Pos.Y) });
		}
	}

	didMount() {
		this.janitor.Add(RunService.Heartbeat.Connect(() => this.updatePosition()));
	}

	willUnmount() {
		this.janitor.Cleanup();
	}
}
