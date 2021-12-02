import { Essential } from "./Essential";
import { Component } from "@flamework/components";
import { ToolAttributes, ToolInstance } from "./Tool";
import { Action } from "server/modules/Action";
import { Events } from "server/events";
import { playAnim } from "server/modules/AnimPlayer";
import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";
import { Directions } from "shared/types";
import ClientCast from "@rbxts/clientcast";
import Config from "shared/Config";
import Signal from "@rbxts/signal";
import { IsAttacking, TryCancelWeapon, TryStopSwing } from "server/modules/CancelWeapon";
import { textChangeRangeIsUnchanged } from "typescript";

const AttachmentName = "DmgPoint";

const [HitMiddleWare, AddHitMiddleware] = GenerateMiddleware<[Weapon, Instance, Map<Instance, boolean>]>();
const [DamageMiddleware, AddDamageMiddleware] = GenerateMiddleware<[Weapon, Player]>();
const [SwingMiddleware, AddSwingMiddleware] = GenerateMiddleware<[Weapon]>();
const [DrawMiddleware, AddDrawMiddleware] = GenerateMiddleware<[Weapon]>();

export { AddHitMiddleware, AddDamageMiddleware, AddSwingMiddleware, AddDrawMiddleware };

const ReleasePosition = 3;
const BaseDamage = 20;
const MaxDamage = 40;
const secToMax = 2;

const Limbs = [
	"LeftUpperArm",
	"LeftLowerArm",
	"LeftHand",
	"RightUpperArm",
	"RightLowerArm",
	"RightHand",
	"LeftUpperLeg",
	"LeftLowerLeg",
	"LeftFoot",
	"RightUpperLeg",
	"RightLowerLeg",
	"RightFoot",
	"Head",
	"UpperTorso",
	"LowerTorso",
	"HumanoidRootPart",
];

export interface WeaponInstance extends ToolInstance {
	DmgPart: BasePart & {
		End: Attachment;
		Start: Attachment;
	};
	Blocker: BasePart;
}

@Component()
export abstract class Weapon<T extends WeaponInstance = WeaponInstance> extends Essential<ToolAttributes, T> {
	static Weapons = new Map<WeaponInstance, Weapon>();
	readonly FadeInTime = 0.35;
	protected abstract readonly AttackAnimations: {
		UP: number;
		DOWN: number;
		LEFT: number;
		RIGHT: number;
	};
	protected abstract readonly BlockAnimations: {
		UP: number;
		DOWN: number;
		LEFT: number;
		RIGHT: number;
	};
	private LoadedAnimations?: {
		UP: AnimationTrack;
		DOWN: AnimationTrack;
		LEFT: AnimationTrack;
		RIGHT: AnimationTrack;
	};
	private timePassed = 0;
	protected abstract Fade?: number;
	protected abstract weaponPlayerInit(): void;
	protected Trail: Trail;
	protected readonly TrailLifetime = 0.2;
	protected readonly TrailTransparency = new NumberSequence([
		new NumberSequenceKeypoint(0, 0.9),
		new NumberSequenceKeypoint(0.25, 0.925),
		new NumberSequenceKeypoint(0.5, 0.95),
		new NumberSequenceKeypoint(0.75, 0.975),
		new NumberSequenceKeypoint(1, 1),
	]);
	readonly Speed = 1.4;
	Ping = 0;

	readonly Incompatible = ["RbxTool", "Sword", "Bow", "Spear"];
	ShouldEnableArrows = false;

	Direction: Directions = "RIGHT";
	SetDirection: Directions = "RIGHT";
	Damage = 0;
	Hitbox;
	db: Map<Instance, boolean> = new Map();

	ActiveAnimation?: AnimationTrack;
	BlockAnimation?: AnimationTrack;
	DirectionChanged = new Signal<(Direction: Directions) => void>();
	FirstTimeDisabled = true;
	TimeSwingEnded?: number;
	TimeSwingStarted?: number;
	TimeDrawStarted?: number;
	readonly HitStopLength = 0.1;
	TimeStopped?: number;

	playerInit(player: Player) {
		this.weaponPlayerInit();
		const Params = new RaycastParams();
		const [Player, Character] = this.GetCharPlayer();

		Params.FilterDescendantsInstances = [Character, this.instance];
		Params.FilterType = Enum.RaycastFilterType.Blacklist;

		this.Hitbox.EditRaycastParams(Params);

		this.janitor.Add(
			Events.Direction.connect((player, direction) => {
				if (player === this.Player) {
					this.Direction = direction;
					this.DirectionChanged.Fire(direction);
				}
			}),
		);

		if (Config.Elements.ClientTrackedCollisions) {
			this.Hitbox.SetOwner(Player); // client
		} else {
			this.Hitbox.SetOwner(undefined); // server
		}

		this.LoadedAnimations = {
			UP: playAnim(Character, this.AttackAnimations.UP, { Play: false }),
			DOWN: playAnim(Character, this.AttackAnimations.DOWN, { Play: false }),
			RIGHT: playAnim(Character, this.AttackAnimations.RIGHT, { Play: false }),
			LEFT: playAnim(Character, this.AttackAnimations.LEFT, { Play: false }),
		};

		this.janitor.Add(() => {
			this.LoadedAnimations?.UP?.Destroy();
			this.LoadedAnimations?.DOWN?.Destroy();
			this.LoadedAnimations?.RIGHT?.Destroy();
			this.LoadedAnimations?.LEFT?.Destroy();
			this.LoadedAnimations = undefined;
		});

		this.InitAnim(this.LoadedAnimations.UP);
		this.InitAnim(this.LoadedAnimations.DOWN);
		this.InitAnim(this.LoadedAnimations.RIGHT);
		this.InitAnim(this.LoadedAnimations.LEFT);

		this.UpdatePing();
	}

	InitAnim(anim: AnimationTrack) {
		this.janitor.Add(
			anim.GetMarkerReachedSignal("DrawEnd").Connect(() => {
				if (this.state === "Drawing") {
					anim.AdjustSpeed(0);
				}
			}),
		);
	}

	UpdatePing() {
		let UpdatePing = true;
		task.spawn(() => {
			while (UpdatePing) {
				task.wait(1);
				this.Ping = this.Hitbox.GetPing();
			}
		});
		this.janitor.Add(() => {
			UpdatePing = false;
		});
	}

	ReturnToBlock = false;

	constructor() {
		super();

		Weapon.Weapons.set(this.instance, this);

		this.maid.GiveTask(() => {
			Weapon.Weapons.delete(this.instance);
		});

		this.maid.GiveTask(this.DirectionChanged);

		const EndBlock = {
			Action: "EndBlock",
			Mobile: {
				Position: UDim2.fromScale(0.6175, 0.0),
			},
		};

		const Block = {
			Action: "Block",
			Mobile: {
				Position: UDim2.fromScale(0.6175, 0.0),
			},
		};

		const Draw = {
			Action: "Draw",
			Mobile: {
				Position: UDim2.fromScale(0.6175, 0.2),
			},
		};

		this.InputInfo.Enabled.Begin = {
			MouseButton1: Draw,
			MouseButton2: Block,
		};

		this.InputInfo.Drawing = {
			End: {
				MouseButton1: {
					Action: "Release",
					Mobile: {
						Position: UDim2.fromScale(0.6175, 0.2),
					},
				},
			},

			Begin: {
				MouseButton2: Block,
			},
		};

		this.InputInfo.Releasing = {
			Begin: {
				MouseButton2: Block,
			},
		};

		this.InputInfo.Blocking = {
			Begin: {
				MouseButton1: Draw,
				MouseButton2: EndBlock,
			},
		};

		this.Actions.Draw = new Action((End, janitor) => this.Draw(End, janitor));
		this.Actions.Release = new Action((End, janitor) => this.Release(End, janitor));
		this.Actions.Block = new Action((End, janitor) => this.Block(End, janitor));
		this.Actions.EndBlock = new Action((End, janitor) => this.EndBlock(End, janitor));

		let Start = this.instance.DmgPart.Start;
		let End = this.instance.DmgPart.End;

		Start.Name = AttachmentName;
		End.Name = AttachmentName;

		if (Start.Position.Y > End.Position.Y) {
			[Start, End] = [End, Start];
		}

		const inc = 0.1;
		for (let i: number = Start.Position.Y + inc; i < End.Position.Y; i += inc) {
			const Attachment = new Instance("Attachment");
			Attachment.Position = new Vector3(0, i, 0);
			Attachment.Parent = this.instance.DmgPart;
			Attachment.Name = AttachmentName;
		}

		const Trail = new Instance("Trail");
		this.Trail = Trail;
		Trail.Parent = this.instance.DmgPart;
		Trail.Attachment0 = Start;
		Trail.Attachment1 = End;
		Trail.Transparency = this.TrailTransparency;
		Trail.Lifetime = this.TrailLifetime;

		this.Hitbox = new ClientCast(this.instance.DmgPart, new RaycastParams());
		Trail.Enabled = false;

		this.Hitbox.Collided.Connect((collision) => {
			const hit = collision.Instance;
			if (this.db.get(hit)) {
				return;
			}
			this.db.set(hit, true);
			if (!hit.IsA("BasePart")) {
				error("Expected basepart.");
			}
			const Amount = hit.Position.sub(this.instance.DmgPart.Position).Magnitude;
			if (Amount > 7 + this.Ping * Config.Attributes.WalkSpeed * 2 || Amount > 15) {
				if (Amount > 15) {
					if (Players.GetPlayerFromCharacter(hit.Parent)) {
						Events.DisplayMessage(
							Players.GetPlayers(),
							`${this.Player} attempted to hit ${Players.GetPlayerFromCharacter(
								hit.Parent,
							)}'s ${hit} from ${Amount} studs with ${this.Ping}s ping.`,
						);
					}
				}
				return;
			}

			const Player = Players.GetPlayerFromCharacter(hit.Parent);
			if (Player !== undefined) {
				if (this.db.get(Player)) {
					return;
				}
				this.db.set(Player, true);
				const IsLimb = Limbs.find((value) => {
					if (value === hit.Name) {
						return true;
					}
				});
				if (IsLimb === undefined) {
					if (this.db.get(Player)) {
						this.db.set(Player, false);
					}
					return;
				}

				if (Player === this.Player) {
					return;
				}

				RunMiddleware(HitMiddleWare, this, Player, this.db);
				const Character = hit.Parent;
				if (!Character) {
					error();
				}
				const Humanoid = Character.FindFirstChildWhichIsA("Humanoid");
				if (!Humanoid) {
					error();
				}

				Humanoid.TakeDamage(this.Damage);
			} else {
				RunMiddleware(HitMiddleWare, this, hit, this.db);
			}
		});

		this.maid.GiveTask(
			this.WasDisabled.Connect(() => {
				const [Player, Character] = this.GetCharPlayer();
				if (this.FirstTimeDisabled) {
					this.FirstTimeDisabled = false;
					return;
				}
				Events.ToggleDirectionalArrows(Player, false);
			}),
		);

		this.maid.GiveTask(
			this.WasEnabled.Connect(() => {
				const [Player, Character] = this.GetCharPlayer();
				Events.ToggleDirectionalArrows(Player, true);
			}),
		);

		this.maid.GiveTask(
			this.DirectionChanged.Connect((direction) => {
				if (this.state === "Blocking") {
					this.SetBlockAnimation(this.BlockAnimations[direction]);
				}
			}),
		);
	}

	private Block(End: Callback, janitor: Janitor) {
		const [Player, Char] = this.GetCharPlayer();
		for (const child of Char.GetChildren()) {
			if (child.IsA("Model")) {
				const tool = Essential.Tools.get(child);
				if (tool && tool !== this && tool.Actions.Block && tool.state !== "Disabled") {
					return End();
				}
			}
		}
		if (TryStopSwing(this) && !this.ReturnToBlock) {
			return End();
		}
		if (IsAttacking(this)) {
			return End();
		}
		this.ReturnToBlock = false;
		this.setState("Blocking");
		this.SetBlockAnimation(this.BlockAnimations[this.Direction]);
		End();
	}

	private SetBlockAnimation(animationId: number) {
		if (this.BlockAnimation) {
			this.BlockAnimation.Stop(0.15);
			this.BlockAnimation.Destroy();
			this.BlockAnimation = undefined;
		}

		this.BlockAnimation = playAnim(this.Player, animationId, { Fade: 0.15 });
	}

	private EndBlock(End: Callback, janitor: Janitor) {
		this.ReturnToBlock = false;
		if (TryStopSwing(this)) {
			this.setState("Blocking");
			return End();
		}
		this.setState("Enabled");
		this.BlockAnimation?.Stop(0.15);
		this.BlockAnimation?.Destroy();
		this.BlockAnimation = undefined;
		End();
	}

	private Draw(End: Callback, janitor: Janitor) {
		const [Player, Char] = this.GetCharPlayer();
		if (this.state === "Blocking") {
			this.ReturnToBlock = true;
		}
		Events.ToggleDirectionalArrows(Player, false);
		this.setState("Drawing");
		this.ShouldEnableArrows = true;
		this.SetDirection = this.Direction;
		this.setActiveAnimation(this.Direction);
		this.TimeDrawStarted = tick();

		this.Damage = BaseDamage;

		let IncreaseDamage = true;
		janitor.Add(() => {
			IncreaseDamage = false;
		});

		let timePassed = 0;
		this.timePassed = timePassed;
		const time = secToMax / 20;
		while (IncreaseDamage) {
			task.wait(time);
			timePassed += time;
			this.Damage = math.min(timePassed / secToMax, 1) * (MaxDamage - BaseDamage) + BaseDamage;
			if (timePassed >= secToMax) {
				IncreaseDamage = false;
			}
			this.timePassed = timePassed;
		}

		RunMiddleware(DrawMiddleware, this);
		janitor.Add(() => {
			if (this.state === "Drawing") {
				this.setState("Enabled");
			}
		});
	}

	protected SetAnchored(bool: boolean) {
		for (const instance of this.instance.GetDescendants()) {
			if (instance.IsA("BasePart")) {
				instance.Anchored = bool;
			}
		}
	}

	private Release(End: Callback, janitor: Janitor) {
		this.setState("Releasing");
		let Ended = false;
		const [Player, Char] = this.GetCharPlayer();
		const Humanoid = Char.FindFirstChildWhichIsA("Humanoid");
		if (!Humanoid) {
			error("");
		}
		janitor.Add(() => {
			Ended = true;
			this.setState("Enabled");
			this.Hitbox.Stop();
			this.Trail.Enabled = false;
			this.TimeSwingEnded = tick();

			if (this.ReturnToBlock) {
				this.setState("Blocking");
				this.SetBlockAnimation(this.BlockAnimations[this.Direction]);
			}

			if (this.ShouldEnableArrows) {
				Events.ToggleDirectionalArrows(Player, true);
				this.ShouldEnableArrows = false;
			}

			this.TryDestroyActiveAnimation();
		});
		if (!this.Actions.Draw.Status || this.Actions.Draw.Status === "ENDED") {
			error("attempting to release sword when the sword hasn't drawn");
		}
		this.Actions.Draw.End();
		if (!this.ActiveAnimation) {
			error("Active Animation Required From Draw");
		}
		if (this.timePassed < this.FadeInTime) {
			task.wait(this.FadeInTime - this.timePassed);
		}
		this.TimeSwingStarted = tick();
		if (Ended) {
			return;
		}

		RunMiddleware(SwingMiddleware, this);

		this.ActiveAnimation.TimePosition = ReleasePosition;
		this.ActiveAnimation.AdjustSpeed(this.Speed);

		const RemainingLength = (this.ActiveAnimation.Length - ReleasePosition) * (1 / this.Speed);
		this.Hitbox.Start();
		this.Trail.Enabled = true;
		this.db = new Map<Instance, boolean>();

		task.spawn(() => {
			task.wait(RemainingLength - 0.1);
			if (this.ShouldEnableArrows) {
				Events.ToggleDirectionalArrows(Player, true);
				this.ShouldEnableArrows = false;
			}
		});

		task.wait(RemainingLength - this.HitStopLength);
		this.Hitbox.Stop();
		task.wait(this.HitStopLength);
		if (Ended) {
			return;
		}
		End();
	}

	/** returns the previous animationtrack */
	public TryDestroyActiveAnimation(): AnimationTrack | undefined {
		if (this.ActiveAnimation) {
			const prevanimation = this.ActiveAnimation;
			this.ActiveAnimation = undefined;
			prevanimation.Stop(0.25);
			return prevanimation;
		} else {
			return undefined;
		}
	}

	protected setActiveAnimation(direction: Directions) {
		const [Player, Char] = this.GetCharPlayer();
		const prevAnim = this.TryDestroyActiveAnimation();
		if (!this.LoadedAnimations) {
			error("attempting to set active animation when animations have not been loaded");
		}
		this.ActiveAnimation = this.LoadedAnimations[direction];
		this.ActiveAnimation.Play(this.FadeInTime);

		// if (timePosition !== undefined) {
		// 	this.ActiveAnimation.TimePosition = timePosition;
		// }
	}

	Destroy() {}
}
