import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { Bow } from "server/components/Bow";
// import { Essential } from "server/components/Essential";
// import { Shield } from "server/components/Shield";
// import { Spear } from "server/components/Spear";
// import { Sword } from "server/components/Sword";
import { ToolAttributes, ToolInstance } from "server/components/Tool";
import { playAnim } from "./AnimPlayer";
import { Defer } from "./Defer";
// const components = Dependency<Components>();

// function FixAnims(tag: string, instance: Instance) {
// 	if (!instance.IsA("Model")) {
// 		return;
// 	}

// 	const Component = Essential.Tools.get(instance);
// 	if (!Component) {
// 		return;
// 	}

// 	if (Component !== undefined) {
// 		Defer(() => {
// 			if (Component !== undefined) {
// 				Component.EssentialAnimation = playAnim(Component.Player, Component.DisableAnimation, { Looped: true });
// 			}
// 		});
// 	}
// }

export function DisableIncompatibleTools(parent: Instance, incompatibleTags: string[], ignoreInstances: Instance[]) {
	for (const instance of parent.GetChildren()) {
		if (
			ignoreInstances &&
			ignoreInstances.find((inst) => {
				return inst === instance;
			})
		) {
			continue;
		}

		for (const tag of incompatibleTags) {
			if (CollectionService.HasTag(instance, tag)) {
				const Status = instance.GetAttribute("Status");
				if (Status !== undefined && typeIs(Status, "string")) {
					switch (Status) {
						case "Disabled": {
							// FixAnims(tag, instance);
							continue;
						}
						case "Enabled": {
							instance.SetAttribute("Status", "Disabled");
							// FixAnims(tag, instance);
							continue;
						}
						case "Active": {
							return false;
						}
						default: {
							error(`got unknown status ${Status}`);
						}
					}
				}
			}
		}
	}

	return true;
}
