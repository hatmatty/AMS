import { Component } from "@flamework/components";
import Config from "shared/Config";
import { CharacterLimb, Directions } from "shared/Types";
import { ToolAttributes, ToolInstance } from "./Tool";
import { Weapon } from "./Weapon";

const anims = Config.Animations.Sword;
const attackAnims = anims.Attack;
const blockAnims = anims.Block;

@Component({
	tag: "Sword",
	defaults: {
		BUTTON_TOGGLE: "One",
	},
})
export class Sword extends Weapon {
	className = "Sword" as const;
	inheritance = ["Weapon", "Essential"];
	AttachName = "SwordAttach";
	EnableAnimation = anims.Equip;
	DisableAnimation = anims.Holster;
	EnabledLimb = "RightHand" as CharacterLimb;
	DisabledLimb = "LowerTorso" as CharacterLimb;
	AttackAnimations = {
		UP: attackAnims.Overhead,
		DOWN: attackAnims.Stab,
		RIGHT: attackAnims.Right,
		LEFT: attackAnims.Left,
	};
	BlockAnimations = {
		UP: blockAnims.Up,
		DOWN: blockAnims.Down,
		RIGHT: blockAnims.Right,
		LEFT: blockAnims.Left,
	};
	Fade = undefined;

	weaponPlayerInit() {}
	WorkspaceInit = undefined;
}
