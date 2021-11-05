import Roact from "@rbxts/roact";
import { UseSingleFlipper } from "./FlipperUtil";
import { Spring } from "@rbxts/flipper";
import { Direction } from "client/controllers/Direction";

interface props {
	image: string;
	color: Color3;
}

export class Indicator extends Roact.Component<props> {
	motor;
	binding;
	setBinding;

	constructor(props: props) {
		super(props);
		[this.motor, this.binding, this.setBinding] = UseSingleFlipper(1);
	}

	didMount() {
		this.motor.setGoal(new Spring(0, { frequency: 0.5, dampingRatio: 0.4 }));
		task.spawn(() => {
			task.wait(0.05);
			this.motor.setGoal(new Spring(1, { frequency: 0.5, dampingRatio: 0.4 }));
		});
	}

	render() {
		return (
			<screengui IgnoreGuiInset={true} ResetOnSpawn={false}>
				<imagelabel
					Image={this.props.image}
					ImageColor3={this.props.color}
					BackgroundTransparency={1}
					ImageTransparency={this.binding}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
				/>
			</screengui>
		);
	}
}
