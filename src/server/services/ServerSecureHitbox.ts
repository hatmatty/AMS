import { Service, OnInit } from "@flamework/core";
import { Init } from "@rbxts/securehitbox";

@Service({})
export class ServerSecureHitbox implements OnInit {
	onInit() {
		Init();
	}
}
