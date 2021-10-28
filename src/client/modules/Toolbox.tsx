import Roact from "@rbxts/roact";
import { GroupMotor, Instant, SingleMotor, Spring } from "@rbxts/flipper";
import { UseGroupFlipper, UseSingleFlipper } from "./FlipperUtil";
import { Janitor } from "@rbxts/janitor";
import { Events } from "client/events";
import { CollectionService } from "@rbxts/services";

interface fadeAnim {
	type: "FADE";
	pos: UDim2;
}

interface moveAnim {
	type: "MOVE";
	pos1: UDim2;
	pos2: UDim2;
}

export type anim = fadeAnim | moveAnim;

interface props {
	id: string;
	tool: Tool | Model;
	position: number;
	animation: anim;
}

const params = { dampingRatio: 0.75, frequency: 5 };
const Numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "IIX", "IX"];

function handleTransparency(transp: number) {
	return (val: number) => {
		const diff = 1 - transp;
		print(val, transp, diff, (1 - val) * diff);
		return (1 - val) * diff + transp;
	};
}

export class Toolbox extends Roact.Component<props> {
	janitor = new Janitor();

	enabledMotor;
	enabledBinding;
	enabledSetBinding;

	visibleMotor;
	visibleBinding;
	visibleSetBinding;

	posMotor: GroupMotor<{ X: number; Y: number }>;
	posBinding: Roact.Binding<{ X: number; Y: number }>;
	posSetBinding: Roact.BindingFunction<{ X: number; Y: number }>;

	Name = Roact.createRef<TextLabel>();
	ViewportFrame = Roact.createRef<ViewportFrame>();

	constructor(props: props) {
		super(props);
		[this.posMotor, this.posBinding, this.posSetBinding] = UseGroupFlipper({ X: 0.107, Y: 0.094 });
		[this.enabledMotor, this.enabledBinding, this.enabledSetBinding] = UseSingleFlipper(0);
		[this.visibleMotor, this.visibleBinding, this.visibleSetBinding] = UseSingleFlipper(1);
	}

	didMount() {
		this.janitor.Add(
			Events.ToolToggled.connect((id, state) => {
				if (id !== this.props.id) {
					return;
				}

				switch (state) {
					case "Disabled":
						print("GONE");
						this.enabledMotor.setGoal(new Spring(0, params));
						return;
					case "Enabled":
						print("HERE");
						this.enabledMotor.setGoal(new Spring(1, params));
						return;
				}
			}),
		);

		// task.defer(() => {
		// 	const ViewportFrame = this.ViewportFrame.getValue();
		// 	const Name = this.Name.getValue();

		// 	if (!ViewportFrame || !Name) {
		// 		error("Could not find either the viewport or name instances from ref");
		// 	}

		// 	const ViewportCamera = new Instance("Camera", this.props.tool);
		// 	this.janitor.Add(ViewportCamera);
		// 	ViewportCamera.CameraType = Enum.CameraType.Scriptable;
		// 	ViewportFrame.CurrentCamera = ViewportCamera;

		// 	const ViewportPoint = new Vector3(0, 0, 0);
		// 	this.props.tool.Parent = ViewportFrame;

		// 	Name.Destroy();
		// });
	}

	willUnmount() {
		this.janitor.Cleanup();
	}

	render() {
		switch (this.props.animation.type) {
			case "FADE": {
				const pos = this.props.animation.pos;
				this.posMotor.setGoal({
					X: new Instant(pos.X.Scale),
					Y: new Instant(pos.Y.Scale),
				});

				this.visibleMotor.setGoal(new Instant(0));
				this.visibleMotor.setGoal(new Spring(1, params));
				break;
			}
			case "MOVE": {
				const pos1 = this.props.animation.pos1;
				const pos2 = this.props.animation.pos2;

				print(this.props.position, pos1, pos2);
				this.posMotor.setGoal({
					X: new Instant(pos1.X.Scale),
					Y: new Instant(pos1.Y.Scale),
				});

				this.posMotor.setGoal({
					X: new Spring(pos2.X.Scale, params),
					Y: new Spring(pos2.Y.Scale, params),
				});
				break;
			}
		}

		return (
			<frame
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={this.visibleBinding.map(handleTransparency(0.95))}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={this.posBinding.map((val) => {
					return UDim2.fromScale(val.X, val.Y);
				})}
				Size={new UDim2(0.029 * 1.25, 0, 0.052 * 1.25, 0)}
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={this.enabledBinding.map(handleTransparency(0.9))}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
				>
					<uicorner CornerRadius={new UDim(100, 0)} />
				</frame>

				<uicorner CornerRadius={new UDim(100, 0)} />
				<textlabel
					Key="Numeral"
					BackgroundTransparency={1}
					Font={Enum.Font.Fantasy}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					RichText={true}
					Size={new UDim2(0.768, 0, 0.804, 0)}
					Text={Numerals[this.props.position - 1]}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextTransparency={this.visibleBinding.map(handleTransparency(0.8))}
					TextWrapped={true}
				/>
				<textlabel
					Ref={this.Name}
					Key="Name"
					BackgroundTransparency={1}
					Font={Enum.Font.Fantasy}
					Position={new UDim2(0.107, 0, 0.219, 0)}
					RichText={true}
					Size={new UDim2(0.768, 0, 0.5, 0)}
					Text={this.props.tool.Name}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={14}
					TextTransparency={this.visibleBinding.map(handleTransparency(0.3))}
					TextWrapped={true}
				/>
				<viewportframe
					Ref={this.ViewportFrame}
					BackgroundTransparency={1}
					ImageTransparency={this.visibleBinding}
					Position={new UDim2(0.036, 0, 0.036, 0)}
					Size={new UDim2(0.036, 0, 0.036, 0)}
				/>
			</frame>
		);
	}
}
