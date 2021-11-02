import { Component } from "@flamework/components";
import Config from "shared/Config";
import { CharacterLimb, Directions } from "shared/Types";
import { ToolAttributes, ToolInstance } from "./Tool";
import { Weapon } from "./Weapon";

const anims = Config.Animations.Spear;

@Component({
	tag: "Spear",
	defaults: {
		BUTTON_TOGGLE: "One",
	},
})
export class Spear extends Weapon {
	AttachName = "SpearAttach";
	EnableAnimation = anims.Equip;
	DisableAnimation = anims.Holster;
	EnabledLimb = "RightHand" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;
	AttackAnimations = {
		UP: anims.Upper,
		DOWN: anims.Lower,
		RIGHT: anims.Lower,
		LEFT: anims.Lower,
	};
}
