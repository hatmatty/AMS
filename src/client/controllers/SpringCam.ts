import { Controller, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import Spring from "shared/modules/spring";
import { registerNetworkHandler } from "@flamework/networking/out/handlers";
import { hasJSDocParameterTags, HighlightSpanKind } from "typescript";

let Camera = game.Workspace.CurrentCamera;
const Player = Players.LocalPlayer;

import { Equipped, EquippedChanged, GetEquippedCount } from "client/modules/Equipped";
import Object from "@rbxts/object-utils";

const Yoffset = 0.5;
const Xoffset = 1;
const Zoffset = 0;

/**
 * Manages the creation of a spring-based camera on a player's character
 */
@Controller({})
export class SpringCamera implements OnInit {
	private first = true;
	private janitor = new Janitor();
	private charOffset?: Vector3;
	private Running = false;
	private Yoffset = 0;
	private Xoffset = 0;
	private Zoffset = 0;

	/**
	 * calls creates the camera by calling Create() when a player's character is loaded in and destroys the camera by calling Destroy() when the player's character is removed.
	 */
	onInit() {
		if (!Config.Elements.SpringCamera) {
			return;
		}

		Player.CharacterAdded.Connect(() => {
			this.Create();
		});
		Player.CharacterRemoving.Connect(() => this.Destroy());

		if (Player.Character) {
			this.Create();
		}

		this.ProtectToolTransparency();
		EquippedChanged.Connect(() => {
			this.ModifyOffset();
		});
	}

	private ModifyOffset() {
		if (GetEquippedCount() === 0) {
			this.Xoffset = 0;
			this.Yoffset = 0;
			this.Zoffset = 0;
		} else {
			this.Yoffset = Yoffset;
			this.Xoffset = Xoffset;
			this.Zoffset = Zoffset;
		}
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

	private GetPos(): Vector3 {
		const Player = Players.LocalPlayer;
		const Character = Player.Character;
		if (!Character || !Character.IsA("Model")) {
			error("Could not get character model");
		}
		const root = Character.WaitForChild("HumanoidRootPart");
		if (!root?.IsA("BasePart")) {
			error("Could not get humanoid correctly");
		}
		const head = Character.WaitForChild("Head");
		if (!head.IsA("BasePart")) {
			error("got incorrect type for head");
		}
		const neck = head?.FindFirstChild("Neck");
		if (!neck?.IsA("Motor6D")) {
			return head.Position;
		}

		const vector = new Vector3(this.Xoffset, neck.C0.Y + head.Size.Y / 2 + this.Yoffset, this.Zoffset);
		return root.CFrame.ToWorldSpace(new CFrame(vector)).Position;
	}

	/**
	 * Creates the spring camera on the player's head by creating a subject basepart and connecting it's position to a spring which moves to the player's head. Updates the camera on render stepped by calling UpdateCamera with the subject and spring.
	 */
	private Create() {
		if (this.first) {
			this.first = false;
			task.wait(2);
		}

		if (this.Running === true) {
			return;
		}

		this.Running = true;

		if (!Player.Character) {
			error("character is required");
		}

		if (!Camera) {
			error("camera must be present");
		}

		if (!Player.HasAppearanceLoaded()) {
			Player.CharacterAppearanceLoaded.Wait();
		}

		Camera = game.Workspace.CurrentCamera;
		if (!Camera) {
			error();
		}

		const head = Player.Character.WaitForChild("Head", 2);
		const root = Player.Character.WaitForChild("HumanoidRootPart", 2);

		if (!head?.IsA("BasePart") || !root?.IsA("BasePart")) {
			error("got a part with an incorrect type");
		}

		const subject = new Instance("Part");
		subject.Name = "subject";
		subject.CanCollide = false;
		subject.CanTouch = false;
		subject.Transparency = 1;
		subject.Size = new Vector3(0.1, 0.1, 0.1);
		subject.Anchored = true;
		subject.Parent = Player.Character;

		this.janitor.Add(subject);

		subject.Parent = root;
		subject.Position = this.GetPos();
		Camera.CameraSubject = subject;

		const spring = new Spring(subject.Position);
		spring.Speed = 25;
		spring.Damper = 0.8;

		// RunService.BindToRenderStep("UpdateSubject", Enum.RenderPriority.Last.Value, (deltaTime) =>
		// );

		this.janitor.Add(
			RunService.RenderStepped.Connect((deltaTime) => this.UpdateCamera(deltaTime, spring, subject)),
		);

		this.janitor.Add(() => {
			this.Running = false;
		});
	}

	/**
	 *
	 * Updates the camera by setting the goal of the spring and updating the position of the subject.
	 *
	 * @param spring a spring which will have it's goal set to the player's head
	 * @param subject an invisible basepart which will take on the same position as the spring and is the subject of the player's camera
	 */
	private UpdateCamera(deltaTime: number, spring: Spring<Vector3>, subject: BasePart) {
		Camera = game.Workspace.CurrentCamera;

		// CHECKS & ASSIGNMENT
		if (!Camera) {
			error("camera must be present");
		}
		if (!Player.Character) {
			error("character is required");
		}
		if (!subject) {
			error("Subject is nil");
		}

		const head = Player.Character.FindFirstChild("Head");
		const rootPart = Player.Character.FindFirstChild("HumanoidRootPart");
		const humanoid = Player.Character.FindFirstChildWhichIsA("Humanoid");

		if (!head || !rootPart || !head.IsA("BasePart") || !rootPart.IsA("BasePart") || !humanoid) {
			return;
			error(`player head or humanoidrootpart is of an incorrect value - head: ${head},rootPart: ${rootPart}`);
		}

		// BODY
		if (
			Camera.CFrame.Position.sub(subject.Position).Magnitude < 2 ||
			Camera.CFrame.Position.sub(head.Position).Magnitude < 2
		) {
			Camera.CameraSubject = humanoid;
			subject.Position = this.GetPos();
			spring.Target = this.GetPos();
		} else {
			spring.Target = this.GetPos();
			Camera.CameraSubject = subject;
			subject.Position = spring.Position;

			if (UserInputService.MouseBehavior === Enum.MouseBehavior.LockCenter) {
				const lookXZ = new Vector3(Camera.CFrame.LookVector.X, 0, Camera.CFrame.LookVector.Z);
				rootPart.CFrame = CFrame.lookAt(rootPart.Position, rootPart.Position.add(lookXZ));
			}
		}
		Camera.FieldOfView = 85;
	}

	/**
	 * Destroys the camera by cleaning up the janitor which has the subject added if the Create() method was ran and unbinds the UpdateSubject function from renderstepped.
	 */
	private Destroy() {
		this.Yoffset = 0;
		this.Xoffset = 0;
		this.Zoffset = 0;

		this.janitor.Cleanup();
		this.charOffset = undefined;
	}

	/** @ignore */
	constructor() {}
}
