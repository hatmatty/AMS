import { Controller, OnInit } from "@flamework/core";
import { Events } from "client/events";
import { StarterGui } from "@rbxts/services";

@Controller({})
export class Display implements OnInit {
	onInit() {
		Events.DisplayMessage.connect((message) => {
			this.DisplayMessage(message);
		});
	}

	DisplayMessage(message: string) {
		StarterGui.SetCore("ChatMakeSystemMessage", {
			Text: message,
			Color: Color3.fromRGB(255, 75, 75),
			Font: Enum.Font.SourceSansBold,
		});
	}
}
