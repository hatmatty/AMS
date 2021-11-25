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
	FadeInTime = 0.35;
	protected abstract AttackAnimations: {
		UP: number;
		DOWN: number;
		LEFT: number;
		RIGHT: number;
	};
	protected abstract BlockAnimations: {
		UP: number;
		DOWN: number;
		LEFT: number;
		RIGHT: number;
	};
	private timePassed = 0;
	protected abstract Fade?: number;
	protected abstract weaponPlayerInit(): void;
	protected Trail: Trail;
	protected TrailLifetime = 0.2;
	protected TrailTransparency = new NumberSequence([
		new NumberSequenceKeypoint(0, 0.9),
		new NumberSequenceKeypoint(0.25, 0.925),
		new NumberSequenceKeypoint(0.5, 0.95),
		new NumberSequenceKeypoint(0.75, 0.975),
		new NumberSequenceKeypoint(1, 1),
	]);
	Speed = 1.38;
	Ping = 0;

	Incompatible = ["RbxTool", "Sword", "Bow", "Spear"];

	Direction: Directions = "RIGHT";
	SetDirection: Directions = "RIGHT";
	Damage = 0;
	Hitbox;
	db: Map<Instance, boolean> = new Map();

	StoredAnimations: {
		[index: string]: AnimationTrack;
	} = {};

	ActiveAnimation?: AnimationTrack;
	BlockAnimation?: AnimationTrack;
	DirectionChanged = new Signal<(Direction: Directions) => void>();
	FirsTimeDisabled = true;

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
		this.UpdatePing();
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

		this.InputInfo.Enabled.Begin = {
			MouseButton1: {
				Action: "Draw",
				Mobile: {
					Position: UDim2.fromScale(0.6175, 0.2),
				},
			},

			MouseButton2: {
				Action: "Block",
				Mobile: {
					Position: UDim2.fromScale(0.6175, 0.0),
				},
			},
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
		};

		this.InputInfo.Blocking = {
			Begin: {
				MouseButton2: {
					Action: "EndBlock",
					Mobile: {
						Position: UDim2.fromScale(0.6175, 0.0),
					},
				},

				MouseButton1: {
					Action: "Draw",
					Mobile: {
						Position: UDim2.fromScale(0.6175, 0.2),
					},
				},
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
			if (Amount > 5 + this.Ping * Config.Attributes.WalkSpeed * 2 || Amount > 15) {
				print("Stopped hit from", this.Player);
				if (Amount > 15) {
					if (Players.GetPlayerFromCharacter(hit.Parent)) {
						Events.DisplayMessage(
							Players.GetPlayers(),
							`${this.Player} attempted to hit ${hit} from ${Amount} studs with ${this.Ping}s ping.`,
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
				if (this.FirsTimeDisabled) {
					this.FirsTimeDisabled = false;
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
		this.SetDirection = this.Direction;
		this.setActiveAnimation(this.AttackAnimations[this.Direction], janitor);

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
		const [Player, Char] = this.GetCharPlayer();
		let Enabled = false;
		janitor.Add(() => {
			this.setState("Enabled");
			this.Hitbox.Stop();
			this.Trail.Enabled = false;

			if (this.ReturnToBlock) {
				this.setState("Blocking");
				this.SetBlockAnimation(this.BlockAnimations[this.Direction]);
			}

			if (!Enabled) {
				Events.ToggleDirectionalArrows(Player, true);
				Enabled = true;
			}
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

		if (this.Actions.Release.Status === "ENDED") {
			return;
		}

		RunMiddleware(SwingMiddleware, this);

		this.ActiveAnimation.TimePosition = ReleasePosition;
		this.ActiveAnimation.AdjustSpeed(this.Speed);
		this.ActiveAnimation.Stopped.Connect(() => {
			this.ActiveAnimation?.Stop(this.FadeInTime);
		});

		const RemainingLength = (this.ActiveAnimation.Length - ReleasePosition) * (1 / this.Speed);
		this.Hitbox.Start();
		this.Trail.Enabled = true;
		this.db = new Map<Instance, boolean>();

		task.spawn(() => {
			task.wait(RemainingLength - 0.1);
			if (!Enabled) {
				Events.ToggleDirectionalArrows(Player, true);
				Enabled = true;
			}
		});

		task.wait(RemainingLength - 0.2);

		this.Hitbox.Stop();

		// @ts-expect-error time is passing
		if (this.Actions.Release.Status === "ENDED") {
			return;
		}
		End();
	}

	protected setActiveAnimation(animation: number, janitor: Janitor, timePosition?: number) {
		if (this.ActiveAnimation) {
			this.ActiveAnimation.Stop(this.FadeInTime);
			this.ActiveAnimation.Destroy();
			this.ActiveAnimation = undefined;
		}
		this.ActiveAnimation = playAnim(this.Player, animation, {
			Fade: this.Fade !== undefined ? this.Fade : undefined || this.FadeInTime,
		});
		this.ActiveAnimation.Priority = Enum.AnimationPriority.Action;

		janitor.Add(
			this.ActiveAnimation.GetMarkerReachedSignal("DrawEnd").Connect(() => {
				this.ActiveAnimation?.AdjustSpeed(0);
			}),
		);

		if (timePosition !== undefined) {
			this.ActiveAnimation.TimePosition = timePosition;
		}
	}

	Destroy() {}
}
