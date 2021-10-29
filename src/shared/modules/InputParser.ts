export function ParseInput(input: Enum.UserInputState): string;
export function ParseInput(input: Enum.UserInputType): string;
export function ParseInput(input: Enum.KeyCode): string;
export function ParseInput(input: {
	UserInputState: Enum.UserInputState;
	UserInputType: Enum.UserInputType;
	KeyCode: Enum.KeyCode;
}): { Input: string; State: string };
/**
 *
 * This function takes in enums and parses them to be a string. It can take in 3 types of enums, UserInputState, UserInputType, and Keycode or a table which contains all 3 of these enums. When parsing the table, if the Enum.Keycode is "Unknown" it will pass in the InputType as the input.
 *
 * @param input - either a userinputstate, a userinputtype, a keycode, or a table which contains those 3 enums.
 * @returns - either a table containing an Input and State as strings or a string
 */
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

function doCheck(enumKey: "UserInputType" | "UserInputState" | "KeyCode", parsedInput: string): boolean {
	return opcall(() => {
		// @ts-expect-error its ok
		const validate = Enum[enumKey][parsedInput];
	}).success;
}

export function Unparse(parsedInput: string): Enum.UserInputState | Enum.UserInputType | Enum.KeyCode {
	if (doCheck("UserInputType", parsedInput)) {
		// @ts-expect-error am checking
		return Enum.UserInputType[parsedInput];
	} else if (doCheck("UserInputState", parsedInput)) {
		// @ts-expect-error am checking
		return Enum.UserInputState[parsedInput];
	} else if (doCheck("KeyCode", parsedInput)) {
		// @ts-expect-error am checking
		return Enum.KeyCode[parsedInput];
	} else {
		error(`got invalid value: ${parsedInput}`);
	}
}
