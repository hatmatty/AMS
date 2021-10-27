import { Controller, OnStart, OnInit } from "@flamework/core";
import { StarterGui, Players, HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Rodux, { Store } from "@rbxts/rodux";
import RoactRodux from "@rbxts/roact-rodux";
import { Events } from "client/events";
import { State, Toolbar } from "../modules/Toolbar";
import Object from "@rbxts/object-utils";

type Added = {
	type: "ADDED";
	id: string;
	tool: Tool | Model;
	button: number;
};

type Removed = {
	type: "REMOVED";
	id: string;
};

interface Updated {
	type: "UPDATED";
	id: string;
	button: number;
}

type Actions = Added | Removed | Updated | { type: "@@INIT" };

const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

const Reducer: Rodux.Reducer<State, Actions> = (state, action) => {
	switch (action.type) {
		case "@@INIT": {
			return state;
		}
		case "ADDED": {
			const newState = { ...state };
			newState[action.id] = {
				tool: action.tool,
				button: action.button,
				previousButton: undefined,
			};
			return newState;
		}
		case "REMOVED": {
			const newState = { ...state };
			newState[action.id] = undefined;
			return newState;
		}
		case "UPDATED": {
			const newState = { ...state };
			const info = newState[action.id];
			if (info === undefined) {
				error(`${action} is missing`);
			}

			newState[action.id] = {
				tool: info.tool,
				button: action.button,
				previousButton: info.button,
			};
			return newState;
		}
	}

	error("");
};

@Controller({})
export class ToolGui implements OnInit {
	// @ts-expect-error its ok
	Store = new Store(Reducer, { update: HttpService.GenerateGUID() });

	onInit() {
		StarterGui.SetCoreGuiEnabled("Backpack", false);
		Events.ButtonChanged.connect((state, id, tool, button) => {
			print(state, id, tool, button);
			if (state === "REMOVED") {
				this.Store.dispatch({ type: "REMOVED", id: id, tool: tool, button: button });
			} else if (tool === undefined || button === undefined) {
				error(`got invalid state: ${state}`);
			} else if (state === "ADDED") {
				this.Store.dispatch({ type: "ADDED", id: id, tool: tool.Clone(), button: button });
			} else if (state === "UPDATED") {
				this.Store.dispatch({ type: "UPDATED", id: id, button: button });
			}
		});

		Roact.mount(
			Roact.createElement(
				RoactRodux.StoreProvider,
				{
					store: this.Store,
				},
				{
					App: Roact.createElement(
						RoactRodux.connect((state) => {
							return state;
						})(Toolbar),
					),
				},
			),
			PlayerGui,
			"Toolbar",
		);
	}
}
