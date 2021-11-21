import { Controller, OnInit } from "@flamework/core";
import { Init } from "@rbxts/securehitbox";

@Controller({})
export class ClientSecureHitbox implements OnInit {
	onInit() {
		Init();
	}
}
