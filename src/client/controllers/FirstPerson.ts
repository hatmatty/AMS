import { Controller, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";
import { RunService, Players } from "@rbxts/services";
const Player = Players.LocalPlayer;

@Controller({})
export class FirstPerson implements OnInit {
	onInit() {
		if (!Config.Elements.FirstPerson) {
			return;
		}

		this.ProtectToolTransparency();
	}

	private ProtectToolTransparency() {
		this.FirstProtectCheck();

		Player.CharacterAdded.Connect((character) => {
			this.FirstProtectCheck();
			character.ChildAdded.Connect((child) => {
				this.ProtectTool(child);
			});
		});
	}

	private FirstProtectCheck() {
		if (Player.Character) {
			if (!Player.HasAppearanceLoaded()) {
				Player.CharacterAppearanceLoaded.Wait();
			}

			for (const child of Player.Character.GetChildren()) {
				this.ProtectTool(child);
			}
		}
	}

	private ProtectTool(tool: Instance) {
		const name = tool.Name;
		// @ts-expect-error I'm checking if it exists
		const ToolType = Config.Tools[name] as string;

		if (
			name !== "LeftUpperArm" &&
			name !== "RightUpperArm" &&
			name !== "LeftLowerArm" &&
			name !== "RightLowerArm" &&
			name !== "RightHand" &&
			name !== "LeftHand"
		) {
			if (!tool.IsA("Model") || ToolType === undefined) {
				return;
			}
		}

		const Connection = RunService.Heartbeat.Connect(() => {
			if (tool.IsA("BasePart")) {
				tool.LocalTransparencyModifier = 0;
			}
			for (const descendant of tool.GetDescendants()) {
				if (descendant.IsA("BasePart")) {
					descendant.LocalTransparencyModifier = 0;
				}
			}
		});

		const Character = tool.Parent;
		tool.AncestryChanged.Connect(() => {
			if (tool.Parent !== Character || !tool.IsDescendantOf(game)) {
				Connection.Disconnect();
			}
		});
	}
}
