import Roact from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";

interface props {
	tool: string;
	onClick: Callback;
}

export class ToolSelect extends Roact.Component<props> {
	render() {
		return (
			<textbutton
				Key={this.props.tool}
				AutomaticSize={Enum.AutomaticSize.Y}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.9}
				Font={Enum.Font.Fantasy}
				Text={this.props.tool}
				RichText={true}
				Size={new UDim2(0.1, 0, 0.1, 0)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextSize={14}
				TextTransparency={0.5}
				TextWrapped={true}
				Event={{
					MouseButton1Click: () => {
						if (UserInputService.MouseEnabled) {
							this.props.onClick();
						}
					},
					TouchTap: () => {
						if (UserInputService.TouchEnabled) {
							this.props.onClick();
						}
					},
				}}
			>
				<uiaspectratioconstraint />
			</textbutton>
		);
	}
}
