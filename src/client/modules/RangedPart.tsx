import Roact from "@rbxts/roact";
import { UseSingleFlipper } from "./FlipperUtil";
import { Spring } from "@rbxts/flipper";
import { Direction } from "client/controllers/Direction";

interface props {
	prevPercentage: number;
	percentage: number;
	Direction: "X" | "Y";
	Sign: 1 | -1;
	Vertex: UDim2;
	MinDistance: number;
	MaxDistance: number;
	DominantSize: number;
	NormalSize: number;
}

export class RangedPart extends Roact.Component<props> {
	motor;
	binding;
	setBinding;

	constructor(props: props) {
		super(props);
		[this.motor, this.binding, this.setBinding] = UseSingleFlipper(this.props.prevPercentage);
	}

	didUpdate() {
		this.motor.setGoal(new Spring(this.props.percentage, { frequency: 3, dampingRatio: 0.8 }));
	}

	didMount() {
		this.motor.setGoal(new Spring(this.props.percentage, { frequency: 3, dampingRatio: 0.8 }));
	}

	render() {
		return (
			<frame
				BackgroundTransparency={0}
				BackgroundColor3={new Color3(255, 255, 255)}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={
					this.props.Direction === "X"
						? UDim2.fromScale(this.props.DominantSize, this.props.NormalSize)
						: UDim2.fromScale(this.props.NormalSize, this.props.DominantSize)
				}
				Position={this.binding.map((percentage) => {
					const Position = {
						X: this.props.Vertex.X.Scale,
						Y: this.props.Vertex.Y.Scale,
					};

					Position[this.props.Direction] +=
						(this.props.MaxDistance - percentage * (this.props.MaxDistance - this.props.MinDistance)) *
						this.props.Sign;

					return new UDim2(Position.X, this.props.Vertex.X.Offset, Position.Y, this.props.Vertex.Y.Offset);
				})}
			>
				<uiaspectratioconstraint
					AspectRatio={
						this.props.Direction === "X"
							? this.props.DominantSize / this.props.NormalSize
							: this.props.NormalSize / this.props.DominantSize
					}
				/>
			</frame>
		);
	}
}
