import { Networking } from "@flamework/networking";

interface ServerEvents {
	Direction(direction: "DOWN" | "UP"): void;
	Input(input: InputObject, state: Enum.UserInputState): void;
	UpdateRotation(
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	): void;
}

interface ClientEvents {
	AttackStatus(status: "BLOCKED" | "DAMAGED" | "HIT" | "SWUNG"): void;
	UpdateRotation(
		player: Player,
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
