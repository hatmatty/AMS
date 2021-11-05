import Object from "@rbxts/object-utils";
import Roact, { Children, PureComponent } from "@rbxts/roact";
import { Toolbox, anim } from "./Toolbox";
import RoactRodux from "@rbxts/roact-rodux";
import { HttpService, Players } from "@rbxts/services";
import { Events } from "client/events";
import { ToolSelect } from "./ToolSelect";
import Config from "shared/Config";

export interface props {
	tools: string[];
	given: number;
}

export class ToolSelector extends Roact.Component<
	props & {
		generateOnClick: (tool: string) => Callback;
	}
> {
	render() {
		const Elements: Roact.Element[] = [];
		if (this.props.tools.size() > 0 && this.props.given < Config.Attributes.MaxGetTools) {
			Elements.push(this.getToolSelector());
		}
		return (
			<screengui ResetOnSpawn={false} Key="ToolSelector">
				{...Elements}
			</screengui>
		);
	}

	getToolSelector(): Roact.Element {
		return (
			<scrollingframe
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.9}
				CanvasSize={new UDim2(0, 0, 1.5, 0)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				ScrollBarImageColor3={Color3.fromRGB(0, 0, 0)}
				ScrollBarThickness={10}
				Size={new UDim2(0.714, 0, 0.402, 0)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				AutomaticSize={Enum.AutomaticSize.None}
				AutomaticCanvasSize={Enum.AutomaticSize.None}
			>
				<uigridlayout
					CellPadding={new UDim2(0.03, 0, 0, 0)}
					CellSize={new UDim2(0.15, 0, 0.15, 0)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{...this.getTools()}
			</scrollingframe>
		);
	}

	getTools(): Roact.Element[] {
		const Elements: Roact.Element[] = [];
		for (const tool of this.props.tools) {
			Elements.push(<ToolSelect tool={tool} onClick={this.props.generateOnClick(tool)} />);
		}
		return Elements;
	}
}
