export type CharacterLimb =
	| "LeftUpperArm"
	| "LeftLowerArm"
	| "LeftHand"
	| "RightUpperArm"
	| "RightLowerArm"
	| "RightHand"
	| "LeftUpperLeg"
	| "LeftLowerLeg"
	| "LeftFoot"
	| "RightUpperLeg"
	| "RightLowerLeg"
	| "RightFoot"
	| "LowerTorso"
	| "UpperTorso"
	| "Head";

export interface MobileInput {
	Position: UDim2;
	Name: string;
	Input: string;
	State: string;
	Image?: string;
}

export type Directions = "DOWN" | "LEFT" | "RIGHT" | "UP";
