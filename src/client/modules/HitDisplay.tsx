import Roact from "@rbxts/roact";
import { UseGroupFlipper, UseSingleFlipper } from "./FlipperUtil";
import { HttpService, RunService, UserInputService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { GroupMotor, Instant, SingleMotor, Spring } from "@rbxts/flipper";

const MaxSize = new UDim2();
const Start = UDim2.fromScale(0, 0);
const End = UDim2.fromScale(0.07, 0.07);

type unparsedUDim2 = { X: number; Y: number };

export class HitDisplay extends Roact.Component<{ damage: number }, { position: UDim2 }> {
	AnimID = HttpService.GenerateGUID();
	janitor = new Janitor();

	sizeMotor: GroupMotor<unparsedUDim2>;
	sizeBinding: Roact.Binding<unparsedUDim2>;
	setSizeFunction: Roact.BindingFunction<unparsedUDim2>;

	transparencyMotor: SingleMotor;
	transparencyBinding: Roact.Binding<number>;
	setTransparencyFunction: Roact.BindingFunction<number>;

	constructor(props: { damage: number }) {
		super(props);

		[this.sizeMotor, this.sizeBinding, this.setSizeFunction] = UseGroupFlipper({
			X: Start.X.Scale,
			Y: Start.Y.Scale,
		});
		[this.transparencyMotor, this.transparencyBinding, this.setTransparencyFunction] = UseSingleFlipper(1);
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
		this.runAnimation();
		this.janitor.Add(RunService.Heartbeat.Connect(() => this.updatePosition()));
	}

	willUnmount() {
		this.janitor.Cleanup();
	}

	private runAnimation() {
		const ID = HttpService.GenerateGUID();
		this.AnimID = ID;

		const params = { frequency: 1, dampingRatio: 0.4 };

		this.transparencyMotor.setGoal(new Spring(0, params));
		this.transparencyMotor.onComplete(() => {
			print(this.transparencyBinding.getValue());
		});

		this.sizeMotor.setGoal({
			X: new Instant(Start.X.Scale),
			Y: new Instant(Start.Y.Scale),
		});
		this.sizeMotor.setGoal({
			X: new Spring(End.X.Scale, params),
			Y: new Spring(End.Y.Scale, params),
		});

		task.spawn(() => {
			task.wait(1);
			if (this.AnimID === ID) {
				this.transparencyMotor.setGoal(new Spring(1, params));
			}
		});
	}

	public render() {
		return (
			<screengui IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={this.state.position}
					Size={new UDim2(1, 0, 1, 0)}
				>
					<uiaspectratioconstraint />
					<imagelabel
						Key="Hit"
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						Image="rbxassetid://7086461916"
						Position={new UDim2(0.5, 0, 0.5, 0)}
						ScaleType={Enum.ScaleType.Fit}
						Size={this.sizeBinding.map((val) => {
							return UDim2.fromScale(val.X, val.Y);
						})}
						ZIndex={4}
						ImageTransparency={this.transparencyBinding}
					>
						<uiaspectratioconstraint />
					</imagelabel>
					<textlabel
						Key="Info"
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						Font={Enum.Font.Merriweather}
						Position={new UDim2(0.5, 0, 0.55, 0)}
						Size={new UDim2(0.02, 0, 0.02, 0)}
						Text={tostring(this.props.damage)}
						TextColor3={Color3.fromRGB(241, 196, 65)}
						TextScaled={true}
						TextSize={14}
						TextWrapped={true}
						TextTransparency={this.transparencyBinding}
					>
						<uiaspectratioconstraint />
					</textlabel>
				</frame>
			</screengui>
		);
	}
}
