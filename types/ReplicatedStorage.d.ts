interface ReplicatedStorage extends Instance {
	Assets: Folder & {
		Tools: Folder;
		Particles: Folder & {
			Blood1: ParticleEmitter;
			SparkEmitter: ParticleEmitter;
			Blood2: ParticleEmitter;
			Blood3: ParticleEmitter;
		};
		Sounds: Folder & {
			Swing: Folder & {
				Swing1: Sound;
			};
			Blocked: Folder & {
				Blocked1: Sound;
				Blocked3: Sound;
				Blocked2: Sound;
			};
			Hit: Folder & {
				Hit2: Sound;
				Hit1: Sound;
			};
			BowDraw: Folder & {
				BowDraw1: Sound;
			};
			BowFire: Folder & {
				BowFire1: Sound;
			};
		};
	};
}
