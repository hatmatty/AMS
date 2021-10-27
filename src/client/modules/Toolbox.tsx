import Roact from "@rbxts/roact";
import { SingleMotor } from "@rbxts/flipper";
import { UseSingleFlipper } from "./FlipperUtil";

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
	animation: anim;
}

export class Toolbox extends Roact.Component<props> {
	enabledMotor;
	enabledBinding;
	enabledSetBinding;

	visibleMotor;
	visibleBinding;
	visibleSetBinding;

	constructor(props: props) {
		super(props);
		[this.enabledMotor, this.enabledBinding, this.enabledSetBinding] = UseSingleFlipper(0);
		[this.visibleMotor, this.visibleBinding, this.visibleSetBinding] = UseSingleFlipper(0);
	}
	render() {
		return (
			<frame>
				<textlabel Text="1"></textlabel>
			</frame>
		);
	}
}
