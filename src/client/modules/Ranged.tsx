import Roact from "@rbxts/roact";
import { RangedPart } from "./RangedPart";
import { UserInputService, RunService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { MousePos } from "./MousePosition";

//0.4825
const Vertex = UDim2.fromScale(0.5, 0.465);
const MinDistance = 0.03;
const MaxDistance = 0.25;
const DominantSize = 0.02;
const NormalSize = 0.02 / 5;

export class Ranged extends MousePos<{ prevPercentage: number; percentage: number }, { position: UDim2 }> {
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
