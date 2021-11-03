// @written by Infinitum
import { SingleMotor, GroupMotor } from "@rbxts/flipper";
import Roact from "@rbxts/roact";

export function UseSingleFlipper(initVal: number) {
	const motor = new SingleMotor(initVal);

	const [binding, setBinding] = Roact.createBinding(initVal);
	motor.onStep(setBinding);

	return [motor, binding, setBinding] as [SingleMotor, Roact.Binding<number>, Roact.BindingFunction<number>];
}

export function UseGroupFlipper<T extends {}>(initVal: T) {
	const motor = new GroupMotor(initVal);

	const [binding, setBinding] = Roact.createBinding(motor.getValue());
	motor.onStep(setBinding);

	return [motor, binding, setBinding] as [GroupMotor<T>, Roact.Binding<T>, Roact.BindingFunction<T>];
}

export {};
