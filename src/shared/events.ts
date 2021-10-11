import { Networking } from "@flamework/networking";

interface ServerEvents {
	Direction(direction: "DOWN" | "UP"): void;
}

interface ClientEvents {
	AttackStatus(status: "BLOCKED" | "DAMAGED" | "HIT" | "SWUNG"): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
