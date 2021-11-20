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
			Left: 7921642085,
			Right: 7921644381,
			Stab: 7921640417,

			Holster: 7872920456,
			Equip: 8000323371,
		},

		Spear: {
			Upper: 7921664513,
			Lower: 7921656531,

			Holster: 7881452961,
			Equip: 8000459921,
		},

		Shield: {
			Block: 7872966176,
			Holster: 7872995363,
			Equip: 8000387589,
		},
	},

	Elements: {
		Gore: true,
		Sparks: true,
		Sounds: true,
		Rotation: true,
		Direction: true,
		CameraShake: true,
		Sprinting: true,
		SpringCamera: true,
		Ragdoll: true,
		ToolSelector: true,
		StunOnBlock: true,
		StunOnHit: true,
		DontBlockWhenAttacking: true,
		DontBlockWhenEnabled: true,
		DontBlockWhenDisabled: true,
	},

	Attributes: {
		WalkSpeed: 13,
		SprintingSpeed: 18,
		ShieldHitboxSize: new Vector3(2.5, 2.5, 0.75),
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
