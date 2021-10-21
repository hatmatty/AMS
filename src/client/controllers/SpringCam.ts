import { Controller, OnStart, OnInit } from "@flamework/core";
import Config from "shared/Config";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import Spring from "shared/modules/spring";

const Camera = game.Workspace.CurrentCamera;
const Player = Players.LocalPlayer;

/**
 * Manages the creation of a spring-based camera on a player's character
 */
@Controller({})
export class SpringCamera implements OnInit {
	private janitor = new Janitor();

	/**
	 * calls creates the camera by calling Create() when a player's character is loaded in and destroys the camera by calling Destroy() when the player's character is removed.
	 */
	onInit() {
		if (!Config.Elements.SpringCamera) {
			return;
		}

		if (Player.Character) {
			if (!Player.HasAppearanceLoaded()) {
				Player.CharacterAppearanceLoaded.Wait();
			}
			this.Create();
		}

		Player.CharacterAdded.Connect(() => {
			if (!Player.HasAppearanceLoaded()) {
				Player.CharacterAppearanceLoaded.Wait();
			}
			this.Create();
		});
		Player.CharacterRemoving.Connect(() => this.Destroy());
	}

	/**
	 * Creates the spring camera on the player's head by creating a subject basepart and connecting it's position to a spring which moves to the player's head. Updates the camera on render stepped by calling UpdateCamera with the subject and spring.
	 */
	private Create() {
		if (!Player.Character) {
			error("character is required");
		}

		if (!Camera) {
			error("camera must be present");
		}

		const head = Player.Character.WaitForChild("Head");

		if (!head.IsA("BasePart")) {
			error("head has an incorrect type");
		}

		const subject = new Instance("Part");
		subject.CanCollide = false;
		subject.CanTouch = false;
		subject.Transparency = 1;
		subject.Size = new Vector3(0.1, 0.1, 0.1);
		subject.Anchored = true;
		subject.Parent = Player.Character;

		this.janitor.Add(subject);

		subject.Position = head.Position;
		Camera.CameraSubject = subject;

		const spring = new Spring(subject.Position);
		spring.Speed = 60;
		spring.Damper = 1;

		RunService.BindToRenderStep("UpdateSubject", Enum.RenderPriority.Camera.Value, (deltaTime) =>
			SpringCamera.UpdateCamera(deltaTime, spring, subject),
		);
	}

	/**
	 *
	 * Updates the camera by setting the goal of the spring and updating the position of the subject.
	 *
	 * @param spring a spring which will have it's goal set to the player's head
	 * @param subject an invisible basepart which will take on the same position as the spring and is the subject of the player's camera
	 */
	private static UpdateCamera(deltaTime: number, spring: Spring<Vector3>, subject: BasePart) {
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

		if (!head || !rootPart || !head.IsA("BasePart") || !rootPart.IsA("BasePart")) {
			error(`player head or humanoidrootpart is of an incorrect value - head: ${head},rootPart: ${rootPart}`);
		}

		// BODY
		if (
			Camera.CFrame.Position.sub(subject.Position).Magnitude < 1 ||
			Camera.CFrame.Position.sub(head.Position).Magnitude < 1
		) {
			Camera.CameraSubject = head;
			subject.Position = head.Position;
		} else {
			spring.Target = head.Position;
			Camera.CameraSubject = subject;
			subject.Position = spring.Position;

			if (UserInputService.MouseBehavior === Enum.MouseBehavior.LockCenter) {
				const lookXZ = new Vector3(Camera.CFrame.LookVector.X, 0, Camera.CFrame.LookVector.Z);
				rootPart.CFrame = CFrame.lookAt(rootPart.Position, rootPart.Position.add(lookXZ));
			}
		}
	}

	/**
	 * Destroys the camera by cleaning up the janitor which has the subject added if the Create() method was ran and unbinds the UpdateSubject function from renderstepped.
	 */
	private Destroy() {
		RunService.UnbindFromRenderStep("UpdateSubject");
		this.janitor.Cleanup();
	}

	/** @ignore */
	constructor() {}
}
