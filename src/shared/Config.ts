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

		Sword: {
			Left: 7836906176,
			Right: 7836712123,
			Stab: 7836846445,

			Holster: 7566107081,
			Equip: 7532918137,
		},

		Shield: {
			Block: 7566699306,
			Holster: 7566057875,
			Equip: 7566034212,
		},
	},

	Elements: {
		Gore: true,
		Sparks: true,
		Sounds: true,
		Stuns: true,
		Rotation: true,
		Direction: true,
		CameraShake: true,
		Sprinting: true,
		SpringCamera: true,
		Ragdoll: true,
	},

	Attributes: {
		WalkingSpeed: 14,
		SprintingSpeed: 18,
		ShieldHitboxSize: new Vector3(2.5, 2.5, 1),
	},

	Tools: {
		Kopis: "Sword",
		Shield: "Shield",
		Sparta: "Shield",
		Athens: "Shield",
	},
};

export = Config;
