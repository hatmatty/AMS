import { Players, Debris } from "@rbxts/services";
import { Service, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";

@Service()
export class Ragdoll implements OnInit {
	onInit() {
		if (!Config.Elements.Ragdoll) {
			return;
		}

		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				const HumanoidRootPart = character.WaitForChild("HumanoidRootPart");
				const Humanoid = character.FindFirstChildWhichIsA("Humanoid");
				if (!Humanoid || !HumanoidRootPart.IsA("BasePart")) {
					error("could not find humanoid // got incorrect humanoidrootpart");
				}

				Humanoid.BreakJointsOnDeath = false;
				HumanoidRootPart.CanCollide = false;

				Humanoid.Died.Connect(() => {
					const d = character.GetDescendants();

					for (const v of d) {
						if (v.IsA("Motor6D")) {
							if (!v.Parent) {
								continue;
							}
							const socket = new Instance("BallSocketConstraint");
							const part0 = v.Part0;
							if (!part0) {
								continue;
							}
							const joint_name = v.Name;

							const attachment0 =
								v.Parent.FindFirstChild(joint_name + "Attachment") ||
								v.Parent.FindFirstChild(joint_name + "RigAttachment");
							const attachment1 =
								part0.FindFirstChild(joint_name + "Attachment") ||
								part0.FindFirstChild(joint_name + "RigAttachment");
							if (
								attachment0 &&
								attachment1 &&
								attachment0.IsA("Attachment") &&
								attachment1.IsA("Attachment")
							) {
								[socket.Attachment0, socket.Attachment1] = [attachment0, attachment1];
								socket.Parent = v.Parent;
								v.Destroy();
							}
						}
						if (v.IsA("BasePart") && v.Name !== "HumanoidRootPart" && v.Parent === character) {
							v.CanCollide = true;
						}
					}
				});
			});
		});
	}
}
