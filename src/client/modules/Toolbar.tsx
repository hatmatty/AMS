import Object from "@rbxts/object-utils";
import Roact, { Children } from "@rbxts/roact";
import { Toolbox, anim } from "./Toolbox";
import RoactRodux from "@rbxts/roact-rodux";
import { HttpService } from "@rbxts/services";
import { Events } from "client/events";

const BasePosition = new UDim2(0.5, 0, 0.95, 0);
const XSpacing = 0.05;

interface props {
	[id: string]:
		| {
				tool: Tool | Model;
				button: number;
				previousButton?: number;
		  }
		| undefined;
}

const Equipped: { [id: string]: boolean } = {};

Events.ToolToggled.connect((id, state) => {
	Equipped[id] = state === "Enabled" ? true : false;
});

export type State = props;

export class Toolbar extends Roact.Component<props> {
	prevButtonPositions: {
		[button: number]: UDim2;
	} = {};
	total = 0;

	render() {
		const Elements: Roact.Element[] = [];

		const ids = Object.keys(this.props);
		this.total = ids.size() - 2; // because 1 of them is Roact.Children and another "ToggledStatus"

		for (const id of ids) {
			if (id === Roact.Children || id === "ToggledStatus") {
				return;
			}

			const value = this.props[id];
			if (value === undefined) {
				error();
			}
			if (!typeIs(value, "table")) {
				continue;
			}

			let animation: anim | undefined;
			let newPos: UDim2;
			if (value.previousButton === undefined) {
				newPos = this.getPositionFromNumber(value.button);

				animation = {
					type: "FADE",
					pos: newPos,
				};
			} else {
				let prevPos = this.prevButtonPositions[value.previousButton];

				newPos = this.getPositionFromNumber(value.button);
				if (!prevPos) {
					prevPos = newPos;
				}

				animation = {
					type: "MOVE",
					pos1: prevPos,
					pos2: newPos,
				};
			}

			this.prevButtonPositions[value.button] = newPos;

			if (typeIs(id, "number")) {
				error("something went wrong");
			}

			Elements.push(
				<Toolbox
					id={id}
					status={Equipped[id]}
					tool={value.tool}
					position={value.button}
					animation={animation}
				/>,
			);
		}

		Elements.push(<textlabel Text={tostring(Object.keys(this.props).size())}></textlabel>);
		return <screengui ResetOnSpawn={false}>{...Elements}</screengui>;
	}

	getPositionFromNumber(n: number): UDim2 {
		const NewUDim2 = UDim2.fromScale(
			BasePosition.X.Scale + -((this.total - 1) * XSpacing) / 2 + (n - 1) * XSpacing,
			BasePosition.Y.Scale,
		);
		return NewUDim2;
	}
}
