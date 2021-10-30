import { Players, Debris } from "@rbxts/services";
import { Service, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";

@Service()
export class Ragdoll implements OnInit {
	onInit() {
		if (!Config.Elements.Ragdoll) {
			return;
		}

		Players.PlayerAdded.Connect((Player) => {
			Player.CharacterAdded.Connect((Char) => {
				const Humanoid = Char.WaitForChild("Humanoid") && Char.FindFirstChildWhichIsA("Humanoid");
				if (!Humanoid) {
					error("Could not find humanoid~");
				}
				Humanoid.BreakJointsOnDeath = false;
				Humanoid.Died.Connect(() => {
					const HumanoidRootPart = Char.WaitForChild("HumanoidRootPart");
					if (!HumanoidRootPart || !HumanoidRootPart.IsA("BasePart")) {
						error("Got invalid humanoidrootpart");
					}
					const m = new Instance("Model");
					m.Parent = game.Workspace;
					Debris.AddItem(m, 60);
					const g = Char.GetChildren();
					HumanoidRootPart.CanCollide = false;
					for (let i = 0; i <= g.size(); i++) {
						g[i].Parent = m;
					}
					for (const v of g) {
						if (v.IsA("BasePart")) {
							v.SetNetworkOwner(Player);
						} else if (v.IsA("Motor6D")) {
							const [Att0, Att1] = [new Instance("Attachment"), new Instance("Attachment")];
							Att0.CFrame = v.C0;
							Att1.CFrame = v.C1;
							Att0.Parent = v.Part0;
							Att1.Parent = v.Part1;
							const BSC = new Instance("BallSocketConstraint");
							BSC.Attachment0 = Att0;
							BSC.Attachment1 = Att1;
							BSC.Parent = v.Part0;
							if (v.Part1?.Name === "Head") {
								BSC.LimitsEnabled = true;
								BSC.TwistLimitsEnabled = true;
							}
							v.Enabled = false;
						}

						if (v.Name === "AccessoryWeld" && v.IsA("Weld")) {
							const WC = new Instance("WeldConstraint");
							WC.Part0 = v.Part0;
							WC.Part1 = v.Part1;
							WC.Parent = v.Parent;
							v.Enabled = false;
						}
						if (v.Name === "Head" && v.IsA("BasePart")) {
							v.CanCollide = true;
						}
					}
				});
			});
		});
	}
}
