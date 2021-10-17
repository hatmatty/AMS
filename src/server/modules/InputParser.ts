export function ParseInput(input: Enum.UserInputState): string;
export function ParseInput(input: Enum.UserInputType): string;
export function ParseInput(input: Enum.KeyCode): string;
export function ParseInput(input: {
	UserInputState: Enum.UserInputState;
	UserInputType: Enum.UserInputType;
	KeyCode: Enum.KeyCode;
}): { Input: string; State: string };
export function ParseInput(
	input:
		| {
				UserInputState: Enum.UserInputState;
				UserInputType: Enum.UserInputType;
				KeyCode: Enum.KeyCode;
		  }
		| Enum.UserInputState
		| Enum.UserInputType
		| Enum.KeyCode,
): { Input: string; State: string } | string {
	if (typeIs(input, "EnumItem")) {
		const str = tostring(input);
		if (str.sub(0, 20) === "Enum.UserInputState.") {
			return str.sub(21, -1);
		} else if (str.sub(0, 19) === "Enum.UserInputType.") {
			return str.sub(20, -1);
		} else if (str.sub(0, 13) === "Enum.KeyCode.") {
			return str.sub(14, -1);
		} else {
			error(`got invalid value: ${input}`);
		}
	} else {
		const KeyCode = ParseInput(input.KeyCode);
		const Type = ParseInput(input.UserInputType);
		const State = ParseInput(input.UserInputState);

		const Input = KeyCode === "Unknown" ? Type : KeyCode;
		return { Input: Input, State: State };
	}
}
