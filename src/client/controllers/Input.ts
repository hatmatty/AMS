import { Controller, OnStart, OnInit } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/events";
import { createElement } from "typedoc/dist/lib/utils/jsx";

/**
 * Manages the sending of input events from the client to the server through the Input server event.
 */
@Controller({})
export class Input implements OnInit {
	/**
	 * Calls createInputEvent on UserInputService.InputBegan and UserInputService.InputEnded
	 */
	onInit() {
		Input.createInputEvent(UserInputService.InputBegan);
		Input.createInputEvent(UserInputService.InputEnded);
	}

	/**
	 * takes either a UserInputService.InputBegan or InputEnded event and then connects it to a function which fires an event with an inputobject if the input was not processed by the game.
	 *
	 * @param event - UserInputService event (inputbegan/inputended)
	 * @param state - Enum.UserInputState (Enum.UserInputState.End/Begin)
	 */
	private static createInputEvent(event: typeof UserInputService.InputBegan | typeof UserInputService.InputBegan) {
		event.Connect((input, gameProcessedEvent) => {
			if (gameProcessedEvent) {
				return;
			}

			Events.Input({
				UserInputState: input.UserInputState,
				UserInputType: input.UserInputType,
				KeyCode: input.KeyCode,
			});
		});
	}

	/** @ignore */
	constructor() {}
}
