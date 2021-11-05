import { Events } from "client/events";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import Object from "@rbxts/object-utils";

export const Equipped: { [id: string]: boolean } = {};
export const EquippedChanged = new Signal();
Events.ToolToggled.connect((id, state) => {
	Equipped[id] = state === "Enabled" ? true : false;
	EquippedChanged.Fire();
});

const Player = Players.LocalPlayer;
function ManageChar(char: Model) {
	if (!Player.HasAppearanceLoaded()) {
		Player.CharacterAppearanceLoaded.Wait();
	}
	const Humanoid = char.WaitForChild("Humanoid");
	if (!Humanoid.IsA("Humanoid")) {
		error("Humanoid is not of class humanoid.");
	}

	Humanoid.Died.Connect(() => {
		for (const id of Object.keys(Equipped)) {
			// @ts-expect-error its ok im deleting
			Equipped[id] = undefined;
		}
	});
}

export function GetEquippedCount(): number {
	let amount = 0;
	for (const value of Object.values(Equipped)) {
		if (value) {
			amount++;
		}
	}
	return amount;
}

if (Player.Character) {
	ManageChar(Player.Character);
}
Player.CharacterAdded.Connect(ManageChar);
