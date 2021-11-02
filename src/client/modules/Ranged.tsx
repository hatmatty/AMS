import Roact from "@rbxts/roact";
import { RangedPart } from "./RangedPart";
import { UserInputService, RunService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

//0.4825
const Vertex = UDim2.fromScale(0.5, 0.465);
const MinDistance = 0.03;
const MaxDistance = 0.25;
const DominantSize = 0.02;
const NormalSize = 0.02 / 5;

export class Ranged extends Roact.Component<{ prevPercentage: number; percentage: number }, { position: UDim2 }> {
	janitor = new Janitor();

	constructor(props: { prevPercentage: number; percentage: number }) {
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

	render() {
		const Elements: Roact.Element[] = [];
		return (
			<screengui IgnoreGuiInset={true}>
				<frame
					BackgroundTransparency={1}
					Position={this.state.position}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					{this.createRangedPart("X", -1)}
					{this.createRangedPart("X", 1)}
					{this.createRangedPart("Y", -1)}
					{this.createRangedPart("Y", 1)}
				</frame>
			</screengui>
		);
	}

	createRangedPart(direction: "Y" | "X", sign: -1 | 1) {
		return (
			<RangedPart
				prevPercentage={this.props.prevPercentage}
				percentage={this.props.percentage}
				Direction={direction}
				Sign={sign}
				Vertex={UDim2.fromScale(0.5, 0.5)}
				MinDistance={MinDistance}
				MaxDistance={MaxDistance}
				DominantSize={DominantSize}
				NormalSize={NormalSize}
			/>
		);
	}
}
