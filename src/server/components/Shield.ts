import { Component, Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Events } from "server/events";
import { Action } from "server/modules/Action";
import { playAnim } from "server/modules/AnimPlayer";
import { TryCancelWeapon, TryStopSwing } from "server/modules/CancelWeapon";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";
import Config, { Animations } from "shared/Config";
import { CharacterLimb, Directions } from "shared/Types";
import { createPrinter, EndOfLineState } from "typescript";
import { Essential } from "./Essential";
import { ToolAttributes, ToolInstance } from "./Tool";
import { AddHitMiddleware, Weapon, WeaponInstance } from "./Weapon";

let Added = false;

interface ShieldInstance extends ToolInstance {
	ShieldAttach: BasePart;
}

const anims = Config.Animations.Shield;
@Component({
	tag: "Shield",
	defaults: {
		BUTTON_TOGGLE: "Two",
	},
})
export class Shield extends Essential<ToolAttributes, ShieldInstance> {
	className = "Shield" as const;
	AttachName = "ShieldAttach";
	Incompatible = ["Shield", "Bow"];
	EnableAnimation = Config.Animations.Shield.Equip;
	DisableAnimation = Config.Animations.Shield.Holster;
	EnabledLimb = "LeftUpperArm" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;
	Direction: Directions = "RIGHT";
	BlockAnimation?: AnimationTrack;
	TestudoEnabled = false;

	constructor() {
		super();
		this.InputInfo.Enabled.Begin = {
			MouseButton2: {
				Action: "Block",
				Mobile: {
					Position: UDim2.fromScale(0.6175, 0.0),
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

				Q: {
					Action: "Testudo",
					Mobile: {
						Position: UDim2.fromScale(0.8175, 0.0),
					},
				},
			},
		};

		this.Actions.Testudo = new Action((End, janitor) => this.Testudo(End, janitor));
		this.Actions.Block = new Action((End, janitor) => this.Block(End, janitor));
		this.Actions.EndBlock = new Action((End) => this.EndBlock(End));

		task.defer(() => {
			const BodyAttach = this.BodyAttach;
			const Blocker = new Instance("Part");
			Blocker.Name = "Blocker";
			Blocker.Transparency = 1;
			Blocker.CanCollide = false;
			Blocker.CanTouch = true;
			Blocker.Anchored = false;
			Blocker.Size = Config.Attributes.ShieldHitboxSize;

			const Weld = new Instance("Weld");
			Weld.Name = "Blocker";
			Weld.Parent = BodyAttach;
			Weld.Part0 = BodyAttach;
			Weld.Part1 = Blocker;
			Weld.C0 = new CFrame(new Vector3(0, 0, 0.25));

			Blocker.Parent = this.instance;
		});
	}

	private Testudo(End: Callback, janitor: Janitor) {
		const [Player, Char] = this.GetCharPlayer();
		this.BlockAnimation?.Stop(0.15);
		if (this.TestudoEnabled) {
			this.BlockAnimation = playAnim(Char, anims.Block, { Fade: 0.15 });
			this.TestudoEnabled = false;
		} else {
			this.BlockAnimation = playAnim(Char, anims.Testudo, { Fade: 0.15 });
			this.TestudoEnabled = true;
		}
		End();
	}

	private Block(End: Callback, janitor: Janitor) {
		const Weapon = this.GetActiveWeapon();
		if (Weapon?.state === "Blocking") {
			Weapon.Actions.EndBlock.Start();
		}
		if (Weapon && this.IsAttacking()) {
			TryStopSwing(Weapon);
			return End();
		}
		this.TestudoEnabled = false;
		const [Player, Char] = this.GetCharPlayer();

		this.setState("Blocking");
		const Fade = 0.15;
		this.BlockAnimation = playAnim(Char, anims.Block, { Fade: Fade });
		janitor.Add(() => {
			this.BlockAnimation?.Stop(Fade);
		});
	}

	private EndBlock(End: Callback) {
		const Weapon = this.GetActiveWeapon();
		if (Weapon && this.IsAttacking()) {
			TryStopSwing(Weapon);
			return End();
		}
		this.setState("Enabled");
		this.TestudoEnabled = false;
		this.Actions.Block.End();
		End();
	}

	public GetWeapons(): Weapon[] {
		const Weapons: Weapon[] = [];
		const [Player, Char] = this.GetCharPlayer();
		Char.GetChildren().forEach((child) => {
			// @ts-expect-error am checking
			const weapon = Weapon.Weapons.get(child);
			if (weapon) {
				Weapons.push(weapon);
			}
		});
		return Weapons;
	}

	public GetActiveWeapon(): Weapon | undefined {
		let Weapon: Weapon | undefined = undefined;
		this.GetWeapons().forEach((weapon) => {
			if (weapon.state !== "Disabled") {
				if (Weapon) {
					error("Found 2 enabled weapons.");
				}
				Weapon = weapon;
			}
		});
		return Weapon;
	}

	public IsAttacking(): boolean {
		let returnVal = false;
		this.GetWeapons().forEach((weapon) => {
			if (weapon.state === "Releasing" || weapon.state === "Drawing") {
				returnVal = true;
			}
		});
		return returnVal;
	}

	WorkspaceInit = undefined;
	playerInit() {
		const [Player, Char] = this.GetCharPlayer();
		this.janitor.Add(
			Events.Direction.connect((player, direction) => {
				if (player === this.Player) {
					this.Direction = direction;
				}
			}),
		);
	}
	Destroy() {}
}

const components = Dependency<Components>();

const [BlockedMiddleware, AddBlockedMiddleware] = GenerateMiddleware<[Weapon, Essential]>();
export { AddBlockedMiddleware };

if (!Added) {
	Added = true;

	AddHitMiddleware((stop, weapon, hit, db) => {
		if (hit.Name === "Blocker" && hit.Parent?.IsA("Model")) {
			const Component = Essential.Tools.get(hit.Parent);

			if (!Component) {
				error(`Expected shield or weapon from ${hit.Parent}`);
			}

			print(Component.className);

			if (Config.Elements.DontBlockWhenDisabled) {
				if (Component.state === "Disabled") {
					return;
				}
			}

			if (Config.Elements.DontBlockWhenEnabled) {
				if (Component.state === "Enabled") {
					return;
				}
			}

			if (Config.Elements.DontBlockWhenAttacking) {
				if (Component.state !== "Blocking") {
					return;
				}
				if (Component.className === "Shield") {
					const Shield = Component as Shield;
					if (Shield.IsAttacking()) {
						return;
					}
				}
			}

			if (Component.Player === weapon.Player) {
				return;
			}
			const Player = Component.Player;
			if (!Player) {
				error();
			}
			if (db.get(Player)) {
				return; // the player was already hit by the sword so he shouldn't be able to block it
			}
			db.set(Player, true);

			RunMiddleware(BlockedMiddleware, weapon, Component);

			weapon.Actions.Release.End();
			weapon.ActiveAnimation?.Stop(0.2);

			stop(`${Player.Name}'s shield blocked ${weapon.Player?.Name}'s swing`);
		}
	});
}
