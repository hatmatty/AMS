import Roact, { Component } from "@rbxts/roact";
import { Directions } from "shared/types";
import { UseSingleFlipper } from "./FlipperUtil";
import { Spring } from "@rbxts/flipper";

type Motors = "DOWNmotor" | "RIGHTmotor" | "UPmotor" | "LEFTmotor";

export class Arrows extends Roact.Component<{ direction: Directions; prevDirection?: Directions }> {
	Image = "rbxassetid://8082484832";
	Size = UDim2.fromScale(0.1, 0.1);
	Vertex = UDim2.fromScale(0.5, 0.5);
	Transparency = 0.5;
	XDistFromVertex = 0.45;
	MajorYDistFromVertex = 0.45;
	MinorYDistFromVertex = 0.35;

	LEFTmotor;
	LEFTbinding;
	setLEFTtransparnecy;

	RIGHTmotor;
	RIGHTbinding;
	setRIGHTtransparnecy;

	UPmotor;
	UPbinding;
	setUPtransparnecy;

	DOWNmotor;
	DOWNbinding;
	setDOWNtransparnecy;

	constructor(props: { direction: Directions; prevDirection?: Directions }) {
		super(props);

		[this.LEFTmotor, this.LEFTbinding, this.setLEFTtransparnecy] = UseSingleFlipper(1);
		[this.RIGHTmotor, this.RIGHTbinding, this.setRIGHTtransparnecy] = UseSingleFlipper(1);
		[this.UPmotor, this.UPbinding, this.setUPtransparnecy] = UseSingleFlipper(1);
		[this.DOWNmotor, this.DOWNbinding, this.setDOWNtransparnecy] = UseSingleFlipper(1);
	}

	Update() {
		const params = { frequency: 3, dampingRatio: 0.8 };
		const activeMotor = this[(this.props.direction + "motor") as Motors];
		const deactivatedMotor = this.props.prevDirection
			? this[(this.props.prevDirection + "motor") as Motors]
			: undefined;
		if (activeMotor === deactivatedMotor) {
			error("got 2 motors that are the same");
		}

		activeMotor.setGoal(new Spring(this.Transparency, params));
		if (deactivatedMotor) {
			deactivatedMotor.setGoal(new Spring(1, params));
		}
	}

	didUpdate() {
		this.Update();
	}

	didMount() {
		this.Update();
	}

	render() {
		return (
			<screengui ResetOnSpawn={false} IgnoreGuiInset={true}>
				<frame
					Size={UDim2.fromScale(1, 1)}
					Position={this.Vertex}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					{this.GenerateArrow(0, this.LEFTbinding, { drection: "X", sign: -1 })}
					{this.GenerateArrow(180, this.RIGHTbinding, { drection: "X", sign: 1 })}
					{this.GenerateArrow(90, this.UPbinding, { drection: "Y", sign: -1 })}
					{this.GenerateArrow(270, this.DOWNbinding, { drection: "Y", sign: 1 })}
				</frame>
			</screengui>
		);
	}

	GenerateArrow(
		rotation: number,
		binding: Roact.Binding<number>,
		movement: {
			drection: "X" | "Y";
			sign: -1 | 1;
		},
	) {
		const X =
			movement.drection === "X"
				? this.Vertex.X.Scale + this.XDistFromVertex * movement.sign
				: this.Vertex.X.Scale;
		const Y =
			movement.drection === "Y"
				? movement.sign === -1
					? this.Vertex.Y.Scale + this.MajorYDistFromVertex * movement.sign
					: this.Vertex.Y.Scale + this.MinorYDistFromVertex * movement.sign
				: this.Vertex.Y.Scale;
		const Position = UDim2.fromScale(X, Y);

		return (
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				Image={this.Image}
				Size={this.Size}
				Position={Position}
				ImageTransparency={binding}
				BackgroundTransparency={1}
				Rotation={rotation}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
		);
	}
}
