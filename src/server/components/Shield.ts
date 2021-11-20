import { Component, Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Action } from "server/modules/Action";
import { playAnim } from "server/modules/AnimPlayer";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";
import Config from "shared/Config";
import { CharacterLimb } from "shared/Types";
import { EndOfLineState } from "typescript";
import { Essential } from "./Essential";
import { ToolAttributes, ToolInstance } from "./Tool";
import { AddHitMiddleware, Weapon, WeaponInstance } from "./Weapon";

let Added = false;

interface ShieldInstance extends ToolInstance {
	ShieldAttach: BasePart;
}

@Component({
	tag: "Shield",
	defaults: {
		BUTTON_TOGGLE: "Two",
	},
})
export class Shield extends Essential<ToolAttributes, ShieldInstance> {
	AttachName = "ShieldAttach";
	Incompatible = ["Shield", "Bow"];
	EnableAnimation = Config.Animations.Shield.Equip;
	DisableAnimation = Config.Animations.Shield.Holster;

	EnabledLimb = "LeftUpperArm" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;

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
			},
		};

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

	private Block(End: Callback, janitor: Janitor) {
		const [Player, Char] = this.GetCharPlayer();
		if (Char.GetAttribute("Swinging") !== undefined) {
			return End();
		}
		this.GetWeapon();

		this.setState("Blocking");
		const Fade = 0.15;
		const AnimTrack = playAnim(Char, Config.Animations.Shield.Block, { Fade: Fade });
		janitor.Add(() => {
			AnimTrack.Stop(Fade);
		});
	}

	private GetWeapon(): Instance[] {
		const [Player, Char] = this.GetCharPlayer();
		Char.GetChildren().forEach((child) => {
			components;
		});
		return [];
	}

	private EndBlock(End: Callback) {
		this.setState("Enabled");
		this.Actions.Block.End();
		End();
	}

	public IsAttacking(): boolean {
		const [Player, Char] = this.GetCharPlayer();
		Char.GetChildren().forEach((child) => {
			if (child.IsA("Model")) {
				const Tool = Essential.Tools.get(child);
				if (Tool) {
					if (Tool.state === "Releasing" || Tool.state === "Drawing") {
						return true;
					}
				}
			}
		});

		return false;
	}

	WorkspaceInit = undefined;
	playerInit() {}
	Destroy() {}
}

const components = Dependency<Components>();

const [BlockedMiddleware, AddBlockedMiddleware] = GenerateMiddleware<[Weapon, Shield]>();
export { AddBlockedMiddleware };

if (!Added) {
	Added = true;

	AddHitMiddleware((stop, weapon, hit, db) => {
		if (hit.Name === "Blocker") {
			const Shield = components.getComponent<Shield>(hit.Parent as Model);
			if (!Shield) {
				error(`Expected shield from ${hit.Parent}`);
			}

			if (Config.Elements.DontBlockWhenDisabled) {
				if (Shield.state === "Disabled") {
					return;
				}
			}

			if (Config.Elements.DontBlockWhenEnabled) {
				if (Shield.state === "Enabled") {
					return;
				}
			}

			if (Config.Elements.DontBlockWhenAttacking) {
				if (Shield.IsAttacking()) {
					return;
				}
			}

			if (Shield.Player === weapon.Player) {
				return;
			}
			const Player = Shield.Player;
			if (!Player) {
				error();
			}
			if (db.get(Player)) {
				return; // the player was already hit by the sword so he shouldn't be able to block it
			}
			db.set(Player, true);

			RunMiddleware(BlockedMiddleware, weapon, Shield);

			weapon.Actions.Release.End();
			weapon.ActiveAnimation?.Stop(0.2);

			stop(`${Player.Name}'s shield blocked ${weapon.Player?.Name}'s swing`);
		}
	});
}
