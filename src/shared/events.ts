import { Networking } from "@flamework/networking";

interface ServerEvents {
	Direction(direction: "DOWN" | "LEFT" | "RIGHT"): void;
	Input(input: {
		UserInputState: Enum.UserInputState;
		UserInputType: Enum.UserInputType;
		KeyCode: Enum.KeyCode;
	}): void;
	UpdateRotation(
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	): void;
}

interface ClientEvents {
	AttackStatus(status: "GAVE_BLOCK" | "GOT_BLOCK" | "DAMAGED" | "HIT" | "SWUNG"): void;
	UpdateRotation(
		player: Player,
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	): void;
	ButtonChanged(state: "ADDED" | "REMOVED" | "UPDATED", id: string, tool?: Tool | Model, button?: number): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
