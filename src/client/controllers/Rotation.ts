import { Controller, OnStart, OnInit } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Players, TweenService, RunService } from "@rbxts/services";
import { Events } from "client/events";
import Config from "shared/Config";
import { addEmitHelper, createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";

const Player = Players.LocalPlayer;
const Camera = game.Workspace.CurrentCamera;
const [asin, CFAng] = [math.asin, CFrame.Angles];

/**
 * Handles the rotation of a player's body to match the direction of their camera.
 */
@Controller({})
export class Rotation implements OnInit {
	/**
	 * Other controllers can access this Enabled property to disable the body rotator
	 */
	public Enabled = true;
	private janitor = new Janitor();
	private delay = 0.4; // how fast the body rotator should fire an update to the server
	public ClampValue = 0.5;
	private Factor = 1;

	/**
	 * Manages the starting of the BodyRotation when the player's character is created and connects to the UpdateRotation client event for when the rotation of other character's updates so that it replicates here.
	 */
	onInit() {
		if (!Config.Elements.Rotation) {
			return;
		}

		if (Player.Character) {
			this.Start(Player.Character);
		}

		Player.CharacterAdded.Connect((char) => this.Start(char));

		Events.UpdateRotation.connect((player, neckCFrame, waistCFrame, leftShoulderCFrame, rightShoulderCFrame) => {
			Rotation.UpdateOtherRotation(player, neckCFrame, waistCFrame, leftShoulderCFrame, rightShoulderCFrame);
		});
	}

	/**
	 * Starts the character's rotation by connecting the renderstepped event to the this.UpdateOwnRotation method and fires an event every this.delay seconds which informs the server of the player's new body rotation
	 */
	Start(character: Model) {
		const humanoid = character.WaitForChild("Humanoid");
		if (!humanoid.IsA("Humanoid")) {
			error("incorrect humanoid type");
		}

		const deadConnection = humanoid.Died.Connect(() => {
			deadConnection.Disconnect();
			this.Stop();
		});

		const Head = character.WaitForChild("Head");
		const UpperTorso = character.WaitForChild("UpperTorso");
		const RightUpperArm = character.WaitForChild("RightUpperArm");
		const LeftUpperArm = character.WaitForChild("LeftUpperArm");
		const Root = character.WaitForChild("HumanoidRootPart");

		const Waist = UpperTorso.WaitForChild("Waist");
		const Neck = Head.WaitForChild("Neck");
		const RightShoulder = RightUpperArm.WaitForChild("RightShoulder");
		const LeftShoulder = LeftUpperArm.WaitForChild("LeftShoulder");

		if (
			!Head.IsA("BasePart") ||
			!UpperTorso.IsA("BasePart") ||
			!RightUpperArm.IsA("BasePart") ||
			!LeftUpperArm.IsA("BasePart") ||
			!Root.IsA("BasePart")
		) {
			error("recieved an incorrect type for a player limb");
		}

		if (
			!Waist.IsA("Motor6D") ||
			!Neck.IsA("Motor6D") ||
			!RightShoulder.IsA("Motor6D") ||
			!LeftShoulder.IsA("Motor6D")
		) {
			error("recieved an incorrect type for a player joint");
		}

		const NeckYOffset = Neck.C0.Y;

		const RightShoulderXOffset = RightShoulder.C0.X;
		const RightShoulderYOffset = RightShoulder.C0.Y;

		const LeftShoulderXOffset = LeftShoulder.C0.X;
		const LeftShoulderYOffset = LeftShoulder.C0.Y;

		this.janitor.Add(
			RunService.RenderStepped.Connect(() =>
				this.UpdateOwnRotation(
					NeckYOffset,
					RightShoulderXOffset,
					RightShoulderYOffset,
					LeftShoulderXOffset,
					LeftShoulderYOffset,
				),
			),
		);

		let run = true;
		this.janitor.Add(() => {
			run = false;
		});

		coroutine.resume(
			coroutine.create(() => {
				while (run && Promise.delay(this.delay).await()[0]) {
					Events.UpdateRotation(Neck.C0, Waist.C0, LeftShoulder.C0, RightShoulder.C0);
				}
			}),
		);
	}

	/**
	 * Takes in a set of default offsets which should have been gathered before setting this as this could possibly alter the offsets and then updates the cframes of the limbs to face the same direction the camera is facing.
	 */
	UpdateOwnRotation(
		NeckYOffset = 0,
		RightShoulderXOffset = 0,
		RightShoulderYOffset = 0,
		LeftShoulderXOffset = 0,
		LeftShoulderYOffset = 0,
	) {
		const factor = this.Factor;

		const character = Player.Character;

		if (!character) {
			error("character required to update rotation");
		}

		const Head = character.WaitForChild("Head");
		const UpperTorso = character.WaitForChild("UpperTorso");
		const RightUpperArm = character.WaitForChild("RightUpperArm");
		const LeftUpperArm = character.WaitForChild("LeftUpperArm");
		const Root = character.WaitForChild("HumanoidRootPart");

		const Waist = UpperTorso.WaitForChild("Waist");
		const Neck = Head.WaitForChild("Neck");
		const RightShoulder = RightUpperArm.WaitForChild("RightShoulder");
		const LeftShoulder = LeftUpperArm.WaitForChild("LeftShoulder");

		if (
			!Head.IsA("BasePart") ||
			!UpperTorso.IsA("BasePart") ||
			!RightUpperArm.IsA("BasePart") ||
			!LeftUpperArm.IsA("BasePart") ||
			!Root.IsA("BasePart")
		) {
			error("recieved an incorrect type for a player limb");
		}

		if (
			!Waist.IsA("Motor6D") ||
			!Neck.IsA("Motor6D") ||
			!RightShoulder.IsA("Motor6D") ||
			!LeftShoulder.IsA("Motor6D")
		) {
			error("recieved an incorrect type for a player joint");
		}

		if (!this.Enabled) {
			// this disables all body rotation by tweening all joints to their normal position if they haven't been already
			if (new CFrame(0, 0, 0) !== Waist.C0) {
				Rotation.Tween(Waist, new CFrame(0, 0, 0), 0.5);
			}
			if (new CFrame(0, NeckYOffset, 0) !== Neck.C0) {
				Rotation.Tween(Neck, new CFrame(0, NeckYOffset, 0), 0.5);
			}
			if (new CFrame(LeftShoulderXOffset, LeftShoulderYOffset, 0) !== LeftShoulder.C0) {
				Rotation.Tween(LeftShoulder, new CFrame(LeftShoulderXOffset, LeftShoulderYOffset, 0), 0.5);
			}
			if (new CFrame(RightShoulderXOffset, RightShoulderYOffset, 0) !== RightShoulder.C0) {
				Rotation.Tween(RightShoulder, new CFrame(RightShoulderXOffset, RightShoulderYOffset, 0), 0.5);
			}
			return;
		}

		if (!Camera) {
			error("camera required");
		}
		const CameraDirection = Root.CFrame.ToObjectSpace(Camera.CFrame).LookVector;

		// note - could probs refactor this later on
		const newCFrame1 = new CFrame(0, 0, 0)
			.mul(CFAng(0, -asin(this.CapX(CameraDirection.X / factor)), 0))
			.mul(CFAng(asin(this.CapY(CameraDirection.Y / factor)), 0, 0));
		if (newCFrame1 !== Waist.C0) {
			Rotation.Tween(Waist, newCFrame1);
		}

		const newCFrame2 = new CFrame(0, NeckYOffset, 0)
			.mul(CFAng(0, asin(this.CapX(CameraDirection.X / factor)), 0))
			.mul(CFAng(-asin(this.CapY(CameraDirection.Y / factor)), 0, 0));
		if (newCFrame2 !== Neck.C0) {
			Rotation.Tween(Neck, newCFrame2);
		}

		const newCFrame3 = new CFrame(LeftShoulderXOffset, LeftShoulderYOffset, 0)
			.mul(CFAng(0, -asin(this.CapX(CameraDirection.X / factor)), 0))
			.mul(CFAng(asin(this.CapY(CameraDirection.Y / factor)), 0, 0));
		if (newCFrame3 !== LeftShoulder.C0) {
			Rotation.Tween(LeftShoulder, newCFrame3);
		}

		const newCFrame4 = new CFrame(RightShoulderXOffset, RightShoulderYOffset, 0)
			.mul(CFAng(0, -asin(this.CapX(CameraDirection.X / factor)), 0))
			.mul(CFAng(asin(this.CapY(CameraDirection.Y / factor)), 0, 0));
		if (newCFrame4 !== RightShoulder.C0) {
			Rotation.Tween(RightShoulder, newCFrame4);
		}
	}

	/**
	 * takes in a player and their joints as parameters and finds the motor6ds for the cframes on the character of the player argument and tweens the motor6ds C0 to equal the CFrame passed in
	 */
	private static UpdateOtherRotation(
		player: Player,
		neckCFrame: CFrame,
		waistCFrame: CFrame,
		leftShoulderCFrame: CFrame,
		rightShoulderCFrame: CFrame,
	) {
		const character = player.Character;
		if (!character) {
			error("character not found");
		}

		const Neck = character.WaitForChild("Head").FindFirstChild("Neck");
		const Waist = character.WaitForChild("UpperTorso").FindFirstChild("Waist");
		const LeftShoulder = character.WaitForChild("LeftUpperArm").FindFirstChild("LeftShoulder");
		const RightShoulder = character.WaitForChild("RightUpperArm").FindFirstChild("RightShoulder");

		if (
			!Neck ||
			!Neck.IsA("Motor6D") ||
			!Waist ||
			!Waist.IsA("Motor6D") ||
			!LeftShoulder ||
			!LeftShoulder.IsA("Motor6D") ||
			!RightShoulder ||
			!RightShoulder.IsA("Motor6D")
		) {
			error("could not find the correct value for a player joint");
		}

		const TweenTime = 0.1;
		TweenService.Create(
			Neck,
			new TweenInfo(TweenTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ C0: neckCFrame },
		).Play();
		TweenService.Create(
			Waist,
			new TweenInfo(TweenTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ C0: waistCFrame },
		).Play();
		TweenService.Create(
			LeftShoulder,
			new TweenInfo(TweenTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ C0: leftShoulderCFrame },
		).Play();
		TweenService.Create(
			RightShoulder,
			new TweenInfo(TweenTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ C0: rightShoulderCFrame },
		).Play();
	}

	/**
	 * Simply calls cleanup on the janitor to stop any connected events such as the renderstepped event which is added in Start()
	 */
	private Stop() {
		this.janitor.Cleanup();
	}

	/**
	 * Is used to clamp Y rotation values.
	 * @returns a number which if negative is divded by 3 to make it less negative and then clamped to be between -0.5 and 0.5.
	 */
	private CapY(value: number) {
		if (value <= 0.05) {
			this.Factor = 3;
		} else {
			this.Factor = 1;
		}
		return math.clamp(value, -this.ClampValue, this.ClampValue);
	}

	/**
	 * Is used to clamp X rotation values.
	 * @returns a number between -0.5 and 0.5.
	 */
	private CapX(value: number) {
		value /= 3;
		return math.clamp(value, -this.ClampValue, this.ClampValue);
	}

	/**
	 * Tweens the joint's cframe to be the newcframe over the a period of time equvalent which is the time parameter
	 */
	private static Tween(joint: Motor6D, NewCFrame: CFrame, time = 0.25) {
		TweenService.Create(joint, new TweenInfo(time, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			C0: NewCFrame,
		}).Play();
	}

	/** @ignore */
	constructor() {}
}
