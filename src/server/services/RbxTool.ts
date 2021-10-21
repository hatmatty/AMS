import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { ParseInput } from "server/modules/InputParser";
import { HttpService, Players, CollectionService } from "@rbxts/services";
import { ToolService } from "./ToolService";
import { Janitor } from "@rbxts/janitor";
import { DisableIncompatibleTools } from "server/modules/IncompatibleTools";

@Service({})
export class RbxTool implements OnInit {
	Incompatible = ["Sword", "RbxTool"];
	constructor(private ToolService: ToolService) {}
	onInit() {
		Players.PlayerAdded.Connect((player) => this.InitPlayer(player));
	}

	/**
	 * @param player the player whose backpack will be checked for tool additions
	 */
	private InitPlayer(player: Player) {
		const Character = player.Character;
		if (Character) {
			this.InitCharacter(player, Character);
		}
		player.CharacterAdded.Connect((character) => this.InitCharacter(player, character as Model));
	}

	private InitCharacter(player: Player, Character: Model) {
		const Backpack = player.FindFirstChild("Backpack");
		if (!Backpack || !Backpack.IsA("Backpack")) {
			error();
		}

		for (const instance of Backpack.GetChildren()) {
			this.TryStoreRobloxTool(instance, player);
		}

		Backpack.ChildAdded.Connect((item) => {
			if (item.IsA("Tool")) {
				const doesToolExist = this.ToolService.store.getState()[player.Name]?.find((tool) => {
					return item === tool;
				});
				if (doesToolExist) {
					return;
				}
				this.TryStoreRobloxTool(item, player);
			}
		});
	}

	/**
	 * @param tool the tool to add to the store
	 * @param player the parent property to give when sending the store action
	 */
	private TryStoreRobloxTool(tool: Instance, player: Player) {
		if (!tool.IsA("Tool")) {
			return;
		}

		this.TryInitRobloxTool(tool);
		this.ToolService.store.dispatch({ type: "TOOL_ADDED", tool: tool, parent: player.Name });

		tool.AncestryChanged.Connect(() => {
			if (!tool.IsDescendantOf(game)) {
				this.ToolService.store.dispatch({ type: "TOOL_REMOVED", tool: tool, parent: player.Name });
			}
		});
	}

	public TryInitRobloxTool(tool: Tool) {
		const ToolJanitor = new Janitor();

		if (tool.GetAttribute("INITED") === true) {
			return;
		}

		const player = tool.Parent?.Parent;
		if (!player || !player.IsA("Player")) {
			error("player for tool not found");
		}

		const InputConnection = ToolJanitor.Add(
			Events.Input.connect((Player, input) => {
				if (Player !== player) {
					return;
				}

				const parsedInput = ParseInput(input);

				if (parsedInput.State === "End" && parsedInput.Input === tool.GetAttribute("BUTTON_TOGGLE")) {
					if (tool.Parent?.IsA("Model")) {
						tool.Parent = player;
					} else {
						const character = player.Character;
						if (!character) {
							return;
						}

						if (DisableIncompatibleTools(character, this.Incompatible, [tool])) {
							tool.Parent = character;
						}
					}
				}
			}),
		);

		ToolJanitor.Add(
			tool.AncestryChanged.Connect(() => {
				if (!tool.IsDescendantOf(game)) {
					ToolJanitor.Cleanup();
				} else if (tool.Parent?.IsA("Player") && tool.Parent !== player) {
					ToolJanitor.Cleanup();
				}
			}),
		);

		this.ManageStatusAttribute(tool, player, ToolJanitor);

		tool.SetAttribute("INITED", true);
		tool.SetAttribute("timeCreated", tick());
		tool.SetAttribute("id", HttpService.GenerateGUID());
		tool.SetAttribute("Status", "Disabled");
		CollectionService.AddTag(tool, "RbxTool");
	}

	private ManageStatusAttribute(tool: Tool, player: Player, janitor: Janitor) {
		janitor.Add(
			tool.GetAttributeChangedSignal("Status").Connect(() => {
				const attribute = tool.GetAttribute("Status");
				if (attribute === undefined || !typeIs(attribute, "string")) {
					error();
				}

				switch (attribute) {
					case "Disabled": {
						if (tool.Parent === player) {
							return;
						}
						tool.Parent = player;
						return;
					}
					case "Enabled": {
						const character = player.Character;
						if (!character) {
							return;
						}
						if (tool.Parent === character) {
							return;
						}
						if (DisableIncompatibleTools(character, this.Incompatible, [tool])) {
							tool.Parent = character;
						}
						return;
					}
				}
			}),
		);

		janitor.Add(
			tool.AncestryChanged.Connect(() => {
				if (tool.Parent?.IsA("Player")) {
					tool.SetAttribute("Status", "Disabled");
				} else if (tool.Parent?.IsA("Model")) {
					tool.SetAttribute("Status", "Enabled");
				}
			}),
		);
	}

	public GetAttribute(tool: Tool, attributeName: string, kind: "number" | "string"): unknown {
		const attribute = tool.GetAttribute(attributeName);
		if (attribute === undefined) {
			error(`${attributeName} has not been set`);
		}

		if (typeIs(attribute, kind)) {
			return attribute as unknown;
		} else {
			error("timeCreated is not a number");
		}
	}
}
