import { Controller, OnStart, OnInit } from "@flamework/core";
import { StarterGui } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Rodux, { Store } from "@rbxts/rodux";
import RoactRodux from "@rbxts/roact-rodux";
import { Events } from "client/events";
import { State } from "../modules/Toolbar";

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

type Actions = Added | Removed | Updated;

const Reducer: Rodux.Reducer<State, Actions> = (state, action) => {
	switch (action.type) {
		case "ADDED": {
			state[action.id] = {
				tool: action.tool,
				button: action.button,
				previousButton: undefined,
			};
			break;
		}
		case "REMOVED": {
			state[action.id] = undefined;
			break;
		}
		case "UPDATED": {
			const info = state[action.id];
			if (!info) {
				error(`${action} is missing`);
			}

			state[action.id] = {
				tool: info.tool,
				button: action.button,
				previousButton: info.button,
			};
			break;
		}
	}

	return state;
};

@Controller({})
export class ToolGui implements OnInit {
	Store = new Store(Reducer, {}, [Rodux.loggerMiddleware]);

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
	}
}
