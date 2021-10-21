import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { Essential } from "server/components/Essential";
import { Shield } from "server/components/Shield";
import { Sword } from "server/components/Sword";
import { ToolAttributes, ToolInstance } from "server/components/Tool";
import { playAnim } from "./AnimPlayer";
import { Defer } from "./Defer";
const components = Dependency<Components>();

function FixAnims(tag: string, instance: Instance) {
	let Component: Essential<ToolAttributes, ToolInstance> | undefined = undefined;
	switch (tag) {
		case "Sword": {
			Component = components.getComponent<Sword>(instance);
			break;
		}
		case "Shield": {
			Component = components.getComponent<Shield>(instance);
			break;
		}
		case "RbxTool": {
			return;
		}
		default: {
			warn(`implementation needed for new tool ${tag}`);
		}
	}

	if (Component !== undefined) {
		Defer(() => {
			if (Component !== undefined) {
				Component.EssentialAnimation = playAnim(Component.Player, Component.DisableAnimation, { Looped: true });
			}
		});
	}
}

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
							FixAnims(tag, instance);
							continue;
						}
						case "Enabled": {
							instance.SetAttribute("Status", "Disabled");
							FixAnims(tag, instance);
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
