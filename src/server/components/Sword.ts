import { Component } from "@flamework/components";
import Config from "shared/Config";
import { CharacterLimb, Directions } from "shared/Types";
import { ToolAttributes, ToolInstance } from "./Tool";
import { Weapon } from "./Weapon";

const anims = Config.Animations.Sword;

@Component({
	tag: "Sword",
	defaults: {
		BUTTON_TOGGLE: "One",
	},
})
export class Sword extends Weapon {
	AttachName = "SwordAttach";
	EnableAnimation = anims.Equip;
	DisableAnimation = anims.Holster;
	EnabledLimb = "RightHand" as CharacterLimb;
	DisabledLimb = "LowerTorso" as CharacterLimb;
	AttackAnimations = {
		UP: anims.Stab,
		DOWN: anims.Stab,
		RIGHT: anims.Right,
		LEFT: anims.Left,
	};
	Fade = undefined;
}
