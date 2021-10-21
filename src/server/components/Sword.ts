import { Component } from "@flamework/components";
import Config from "shared/Config";
import { CharacterLimb } from "shared/Types";
import { ToolAttributes, ToolInstance } from "./Tool";
import { Weapon } from "./Weapon";

@Component({
	tag: "Sword",
	defaults: {
		BUTTON_TOGGLE: "One",
	},
})
export class Sword extends Weapon {
	Incompatible = ["RbxTool", "Sword"];
	EnableAnimation = Config.Animations.Sword.Equip;
	DisableAnimation = Config.Animations.Sword.Holster;
	EnabledLimb = "RightHand" as CharacterLimb;
	DisabledLimb = "LowerTorso" as CharacterLimb;

	GetDirection(playerDirection: "UP" | "DOWN", direction: string): string {
		if (direction === "@@INIT") {
			return "RIGHT";
		} else if (playerDirection === "UP") {
			return "STAB";
		} else {
			if (direction === "RIGHT") {
				return "LEFT";
			} else {
				return "RIGHT";
			}
		}
	}

	GetAnimation(direction: string): number {
		const anims = Config.Animations.Sword;
		if (direction === "STAB") {
			return anims.Stab;
		} else if (direction === "RIGHT") {
			return anims.Right;
		} else if (direction === "LEFT") {
			return anims.Left;
		} else {
			error(`could not get an animation for direction - ${direction} `);
		}
	}
}
