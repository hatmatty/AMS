import Roact from "@rbxts/roact";
import { UseSingleFlipper } from "./FlipperUtil";
import { Spring } from "@rbxts/flipper";

export class KillTag extends Roact.Component<{ playerName: string }> {
	transpMotor;
	transpBinding;
	setTranspFunc;

	constructor(props: { playerName: string }) {
		super(props);
		[this.transpMotor, this.transpBinding, this.setTranspFunc] = UseSingleFlipper(1);
	}

	didMount() {
		this.transpMotor.setGoal(new Spring(0, { frequency: 2, dampingRatio: 0.8 }));
		task.spawn(() => {
			task.wait(2);
			this.transpMotor.setGoal(new Spring(1, { frequency: 1, dampingRatio: 0.8 }));
		});
	}

	render() {
		return (
			<screengui IgnoreGuiInset={true} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Size={new UDim2(0.562, 0, 1, 0)}
				>
					<uiaspectratioconstraint />
					<textlabel
						Active={true}
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={1}
						Font={Enum.Font.Merriweather}
						Position={new UDim2(0.51, 0, 0.5, 0)}
						Size={new UDim2(0.089, 0, 0.027, 0)}
						Text="+ Killed"
						TextColor3={Color3.fromRGB(241, 196, 65)}
						TextScaled={true}
						TextSize={14}
						TextWrapped={true}
						TextTransparency={this.transpBinding}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<textlabel
						Active={true}
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={1}
						Font={Enum.Font.Merriweather}
						TextTransparency={this.transpBinding}
						Position={new UDim2(0.6, 0, 0.5, 0)}
						Size={new UDim2(0.385, 0, 0.027, 0)}
						Text={this.props.playerName}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextSize={14}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
			</screengui>
		);
	}
}
