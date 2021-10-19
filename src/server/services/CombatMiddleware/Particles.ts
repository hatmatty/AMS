import { Service, OnInit } from "@flamework/core";
import { AddBlockedMiddleware } from "server/components/Shield";
import { AddHitMiddleware } from "server/components/Weapon";
import { ReplicatedStorage } from "@rbxts/services";
import Config from "shared/Config";

@Service({})
export class Particles implements OnInit {
	onInit() {
		if (Config.Elements.Gore) {
			AddHitMiddleware((stop, weapon, hit, db) => {
				if (hit.IsA("Player")) {
					this.EmitGore(weapon.instance.DmgPart);
				}
			});
		}
		if (Config.Elements.Sparks) {
			AddBlockedMiddleware((stop, weapon, shield) => {
				this.EmitSparks(weapon.instance.DmgPart);
			});
		}
	}

	EmitGore(part: BasePart) {
		let Blood1 = part.FindFirstChild("Blood1");
		let Blood2 = part.FindFirstChild("Blood2");
		let Blood3 = part.FindFirstChild("Blood3");

		if (!Blood1 || !Blood2 || !Blood3) {
			Blood1 = ReplicatedStorage.Assets.Particles.Blood1.Clone();
			Blood2 = ReplicatedStorage.Assets.Particles.Blood2.Clone();
			Blood3 = ReplicatedStorage.Assets.Particles.Blood3.Clone();

			Blood1.Parent = part;
			Blood2.Parent = part;
			Blood3.Parent = part;
		}

		if (!Blood1.IsA("ParticleEmitter") || !Blood2.IsA("ParticleEmitter") || !Blood3.IsA("ParticleEmitter")) {
			error();
		}

		Blood1.Emit(math.random(5, 15));
		Blood2.Emit(math.random(5, 30));
		Blood3.Emit(math.random(5, 30));
	}

	EmitSparks(part: BasePart) {
		let SparkEmitter = part.FindFirstChild("SparkEmitter");
		if (!SparkEmitter) {
			SparkEmitter = ReplicatedStorage.Assets.Particles.SparkEmitter.Clone();
			SparkEmitter.Parent = part;
		}

		if (!SparkEmitter.IsA("ParticleEmitter")) {
			error();
		}

		SparkEmitter.Emit(math.random(5, 15));
	}
}
