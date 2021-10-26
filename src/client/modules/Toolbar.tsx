import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Toolbox, anim } from "./Toolbox";

export interface State {
	[id: string]:
		| {
				tool: Tool | Model;
				button: number;
				previousButton?: number;
		  }
		| undefined;
}

class Toolbar extends Roact.Component<State> {
	prevButtonPositions: {
		[button: number]: UDim2;
	} = {};

	render() {
		const Elements: Roact.Element[] = [];

		const ids = Object.keys(this.props);
		for (const id of ids) {
			if (id === Roact.Children) {
				return;
			}

			const value = this.props[id];
			if (value === undefined) {
				error();
			}

			let animation: anim | undefined;
			let newPos: UDim2;
			if (value.previousButton === undefined) {
				newPos = this.getPositionFromNumber(value.button, ids.size());

				animation = {
					type: "FADE",
					pos: newPos,
				};
			} else {
				const prevPos = this.prevButtonPositions[value.previousButton];
				if (!prevPos) {
					error();
				}
				newPos = this.getPositionFromNumber(value.button, ids.size());

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

			Elements.push(<Toolbox id={id} animation={animation} />);
		}

		return <screengui>{...Elements}</screengui>;
	}

	getPositionFromNumber(n: number, total: number): UDim2 {
		return new UDim2();
	}
}
