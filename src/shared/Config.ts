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
			Shoot: 7873680903,
			Holster: 7873723148,
			Equip: 7873615068,
		},

		Sword: {
			Left: 7872886466,
			Right: 7872890697,
			Stab: 7872877175,

			Holster: 7872920456,
			Equip: 7873049583,
		},

		Shield: {
			Block: 7872966176,
			Holster: 7872995363,
			Equip: 7872952487,
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
		Bow: "Bow",
	},
};

export = Config;
