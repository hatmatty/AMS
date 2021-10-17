import { Component } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Components } from "@rbxts/flamework";
import { GenerateMiddleware, RunMiddleware } from "server/modules/Middleware";
import Config from "shared/Config";
import { CharacterLimb } from "shared/Types";
import { Essential } from "./Essential";
import { ToolAttributes, ToolInstance } from "./Tool";
import { AddHitMiddleware, Weapon } from "./Weapon";

const components = Dependency<Components>();

const [BlockedMiddleware, AddBlockedMiddleware] = GenerateMiddleware<[Weapon, Shield]>();
export { AddBlockedMiddleware };

AddHitMiddleware((stop, tool, hit) => {
	if (hit.Name === "Blocker") {
		const Shield = components.getComponent<Shield>(hit);
		RunMiddleware(BlockedMiddleware, tool, Shield);

		// ...
		stop();
	}
});

interface ShieldInstance extends ToolInstance {}

@Component({
	tag: "Shield",
	defaults: {
		BUTTON_TOGGLE: "Two",
	},
})
export class Shield extends Essential<ToolAttributes, ShieldInstance> {
	EnableAnimation = Config.Animations.Shield.Equip;
	DisableAnimation = Config.Animations.Shield.Holster;

	EnabledLimb = "LeftUpperArm" as CharacterLimb;
	DisabledLimb = "UpperTorso" as CharacterLimb;

	Init() {}

	PlayerInit() {}
}
