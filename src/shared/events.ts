import { Networking } from "@flamework/networking";
import { MobileInput, Directions } from "./types";

interface ServerEvents {
	Direction(direction: Directions): void;
	Input(
		input:
			| {
					type: "UNPARSED";
					UserInputState: Enum.UserInputState;
					UserInputType: Enum.UserInputType;
					KeyCode: Enum.KeyCode;
			  }
			| {
					type: "PARSED";
					Input: string;
					State: string;
			  },
	): void;
	UpdateRotation(
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	): void;
}

interface ClientEvents {
	ToolToggled(id: string, state: "Enabled" | "Disabled"): void;
	SetMobileInput(id: string, inputs: MobileInput[]): void;
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
