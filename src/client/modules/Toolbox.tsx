import Roact from "@rbxts/roact";

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
	render() {
		return <frame></frame>;
	}
}
