import { Controller, OnStart, OnInit } from "@flamework/core";
import { StarterGui, Players, HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Rodux, { Store } from "@rbxts/rodux";
import RoactRodux from "@rbxts/roact-rodux";
import { Events } from "client/events";
import Object from "@rbxts/object-utils";
import { ToolSelector, props } from "client/modules/ToolSelector";
import Config from "shared/Config";
import { getConfigFileParsingDiagnostics } from "typescript";

type SetTools = {
	type: "Set";
	tools: string[];
};

type GiveTool = {
	type: "Give";
	tool: string;
};

type Actions = SetTools | GiveTool | { type: "@@INIT" };

type State = props;

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui");
if (!PlayerGui.IsA("PlayerGui")) {
	error("");
}

function getType(toolName: string): string {
	// @ts-expect-error i'm checking so it's fine
	const toolType = Config.Tools[toolName] as string;
	if (toolType === undefined) {
		error(`tool ${toolType} needs to be added in config `);
	}
	return toolType;
}

function getPriority(toolName: string) {
	const tool = getType(toolName);
	switch (tool) {
		case "Sword": {
			return 4;
		}
		case "Spear": {
			return 3;
		}
		case "Bow": {
			return 2;
		}
		case "Shield": {
			return 1;
		}
		default: {
			error(`need order implementation for new tool ${tool}`);
		}
	}
}

const Reducer: Rodux.Reducer<State, Actions> = (state, action) => {
	switch (action.type) {
		case "@@INIT": {
			return {
				tools: [],
				given: 0,
			};
		}
		case "Set": {
			const newState = { ...state };
			const tools = action.tools;
			tools.sort((a, b) => {
				if (getPriority(a) === getPriority(b)) {
					return a < b;
				} else {
					return getPriority(a) > getPriority(b);
				}
			});
			newState.tools = tools;
			newState.given = 0;

			return newState;
		}
		case "Give": {
			const newState = { ...state };
			const index = newState.tools.findIndex((value) => {
				if (value === action.tool) {
					return true;
				}
			});

			Events.GetTool(action.tool);
			const toolType = getType(action.tool);
			newState.given++;

			newState.tools.remove(index);
			const newTools: string[] = [];

			for (const tool of newState.tools) {
				if (getType(tool) !== toolType) {
					newTools.push(tool);
				}
			}

			newState.tools = newTools;
			return newState;
		}
	}

	error("something went wrong");
};

@Controller({})
export class ToolGui implements OnInit {
	Store = new Store(Reducer);

	onInit() {
		if (!Config.Elements.ToolSelector) {
			return;
		}

		StarterGui.SetCoreGuiEnabled("Backpack", false);

		Roact.mount(
			Roact.createElement(
				RoactRodux.StoreProvider,
				{
					store: this.Store,
				},
				{
					App: Roact.createElement(
						RoactRodux.connect<State, {}, State, State>(
							(state) => {
								return state;
							},
							(dispatch, state) => {
								return {
									generateOnClick: (toolName: string) => {
										return () => {
											dispatch({
												type: "Give",
												tool: toolName,
											});
										};
									},
								};
							},
						)(ToolSelector),
					),
				},
			),
			PlayerGui,
			"Toolbar",
		);

		this.ManageState();
	}

	GetTools(): string[] {
		const tools: string[] = [];
		if (Player.Team) {
			const Children = Player.Team.GetChildren();
			if (Children.size() > 0) {
				for (const child of Children) {
					if (child.IsA("Model") && child.GetChildren().size() === 0) {
						tools.push(child.Name);
					}
				}
			}
		}
		return tools;
	}

	ManageState() {
		this.Store.dispatch({
			type: "Set",
			tools: this.GetTools(),
		});

		Player.CharacterAdded.Connect(() => {
			this.Store.dispatch({
				type: "Set",
				tools: this.GetTools(),
			});
		});

		Player.CharacterRemoving.Connect(() => {
			this.Store.dispatch({
				type: "Set",
				tools: [],
			});
		});
	}
}
