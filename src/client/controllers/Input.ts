import { Controller, OnStart, OnInit } from "@flamework/core";
import { ContextActionService, HttpService, UserInputService, Players } from "@rbxts/services";
import { Events } from "client/events";
import { createElement } from "typedoc/dist/lib/utils/jsx";
import { MobileInput } from "shared/Types";
import { ParseInput, Unparse } from "shared/modules/InputParser";
import { isPartiallyEmittedExpression } from "typescript";
import Object from "@rbxts/object-utils";

const Inputs = new Map<Enum.KeyCode | Enum.UserInputType, boolean>();
// OPTIMIZATION
const InputList = [
	Enum.KeyCode.One,
	Enum.KeyCode.Two,
	Enum.KeyCode.Three,
	Enum.KeyCode.Four,
	Enum.KeyCode.Five,
	Enum.KeyCode.Six,
	Enum.KeyCode.Seven,
	Enum.KeyCode.Eight,
	Enum.KeyCode.Nine,
	Enum.KeyCode.E,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.KeyCode.Q,
];

for (const input of InputList) {
	Inputs.set(input, true);
}

const Player = Players.LocalPlayer;

/**
 * Manages the sending of input events from the client to the server through the Input server event.
 */
@Controller({})
export class Input implements OnInit {
	BindedActions: {
		[index: string]: string[];
	} = {};

	/**
	 * Calls createInputEvent on UserInputService.InputBegan and UserInputService.InputEnded
	 */
	onInit() {
		Input.createInputEvent(UserInputService.InputBegan);
		Input.createInputEvent(UserInputService.InputEnded);

		Player.CharacterRemoving.Connect(() => {
			for (const id of Object.keys(this.BindedActions)) {
				for (const action of this.BindedActions[id]) {
					ContextActionService.UnbindAction(action);
				}
				// @ts-expect-error im removing!
				this.BindedActions[id] = undefined;
			}
		});

		this.StartMobileInput();
	}

	StartMobileInput() {
		Events.SetMobileInput.connect((id, inputs) => {
			if (this.BindedActions[id]) {
				for (const actionName of this.BindedActions[id]) {
					ContextActionService.UnbindAction(actionName);
				}
			}

			this.BindedActions[id] = [];

			for (const input of inputs) {
				const actionName = HttpService.GenerateGUID();
				ContextActionService.BindAction(
					actionName,
					(actionName, state) => {
						if (ParseInput(state) === input.State) {
							Events.Input({ type: "PARSED", Input: input.Input, State: input.State });
						}
					},
					true,
					Enum.KeyCode.Unknown,
				);

				ContextActionService.SetPosition(actionName, input.Position);
				ContextActionService.SetTitle(actionName, input.Name);
				if (input.Image !== undefined) {
					ContextActionService.SetImage(actionName, input.Image);
				}
				this.BindedActions[id].push(actionName);
			}
		});
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

			if (!Inputs.get(input.KeyCode) && !Inputs.get(input.UserInputType)) {
				return;
			}

			Events.Input({
				type: "UNPARSED",
				UserInputState: input.UserInputState,
				UserInputType: input.UserInputType,
				KeyCode: input.KeyCode,
			});
		});
	}

	/** @ignore */
	constructor() {}
}
