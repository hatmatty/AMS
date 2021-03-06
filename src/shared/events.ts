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
	MouseRay(ray: Ray): void;
	GetTool(toolName: string): void;
}

interface ClientEvents {
	UpdateRangedGUI(accuracy: number): void;
	ToggleRangedGUI(state: boolean): void;

	ToolToggled(id: string, state: "Enabled" | "Disabled"): void;
	SetMobileInput(id: string, inputs: MobileInput[]): void;
	Hit(damage: number): void;
	AttackStatus(
		status: "GAVE_BLOCK" | "GOT_BLOCK" | "DAMAGED" | "HIT" | "SWUNG" | "GOT_SHOT" | "GAVE_SHOT" | "RELEASED_SHOT",
	): void;
	UpdateRotation(
		player: Player,
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	): void;
	ButtonChanged(state: "ADDED" | "REMOVED" | "UPDATED", id: string, tool?: Tool | Model, button?: number): void;
	DisplayMessage(mesasge: string): void;
	ToggleDirectionalArrows(bool: boolean): void;
	Killed(playerName: string): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
