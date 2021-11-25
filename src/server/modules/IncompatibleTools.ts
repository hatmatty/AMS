/* eslint-disable roblox-ts/no-any */
import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { Bow } from "server/components/Bow";
import { Tool, ToolAttributes, ToolInstance } from "server/components/Tool";
import { playAnim } from "./AnimPlayer";
import { Defer } from "./Defer";

function FixAnims(tag: string, instance: Instance, tools: Map<ToolInstance, Tool>) {
	if (!instance.IsA("Model")) {
		return;
	}

	const Component = tools.get(instance);
	if (!Component) {
		return;
	}

	if (Component !== undefined) {
		Defer(() => {
			if (Component !== undefined) {
				// @ts-expect-error i am checking for their existence
				if (Component.EssentialAnimation !== undefined && Component.DisableAnimation !== undefined) {
					// @ts-expect-error i have validated their existence
					Component.EssentialAnimation = playAnim(Component.Player, Component.DisableAnimation, {
						Looped: true,
					});
				}
			}
		});
	}
}

export function DisableIncompatibleTools(
	parent: Instance,
	incompatibleTags: string[],
	ignoreInstances: Instance[],
	Tools: Map<ToolInstance, Tool>,
) {
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
							FixAnims(tag, instance, Tools);
							continue;
						}
						case "Enabled": {
							instance.SetAttribute("Status", "Disabled");
							FixAnims(tag, instance, Tools);
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
