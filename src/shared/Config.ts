type ToolName = "Kopis" | "Shield" | "Sparta" | "Athens";

// CONFIG:
const Config = {
	Animations: {
		Walk: 6492892050,

		Stunned: {
			Stab: 7129179801,
			Left: 7129183472,
			Right: 7129034287,
		},

		Bow: {
			Shoot: 8000240237,
			Holster: 7873723148,
			Equip: 8000339022,
		},

		Sword: {
			Attack: {
				Left: 8119288171,
				Right: 8119284412,
				Stab: 8120332970,
				Overhead: 8119294988,
			},

			Block: {
				Up: 8080168777,
				Down: 8086282564,
				Left: 8080156569,
				Right: 8080166525,
			},

			Holster: 7872920456,
			Equip: 8000323371,
		},

		Spear: {
			Attack: {
				Left: 8081419189,
				Right: 8081414401,
				Upper: 8081434481,
				Lower: 7921656531,
			},

			Block: {
				Up: 8081174155,
				Down: 8081183780,
				Left: 8081193234,
				Right: 8081394152,
			},

			Holster: 7881452961,
			Equip: 8072356978,
		},

		Shield: {
			Block: 8081494360,
			Testudo: 8082262094,
			Holster: 7872995363,
			Equip: 8000387589,
		},
	},

	Elements: {
		ClientTrackedCollisions: true,
		DirectionalArrows: true,
		DisableCameraShake: true,
		DisableSpringCamera: true,
		EnhancedFOV: true,
		FirstPerson: true,
		Gore: true,
		Sparks: true,
		Sounds: true,
		Rotation: true,
		Direction: true,
		Ragdoll: true,
		ToolSelector: true,
		StunOnBlock: true,
		StunOnHit: true,
		DontBlockWhenAttacking: true,
		DontBlockWhenEnabled: true,
		DontBlockWhenDisabled: true,
		HigherCamera: true,
	},

	Attributes: {
		WalkSpeed: 15,
		CameraOffset: new Vector3(0, 2, 0),
		ShieldHitboxSize: new Vector3(5, 4, 1),
		MaxGetTools: 2,
	},

	Tools: {
		Shield: "Shield",
		Sparta: "Shield",
		Athens: "Shield",
		Roman: "Shield",
		Kopis: "Sword",
		Bow: "Bow",
		Dory: "Spear",
	},
};

export = Config;
