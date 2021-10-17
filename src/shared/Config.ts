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
			Left: 7632564332,
			Right: 7632959453,
			Stab: 7632993927,

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
		Rotation: true,
		Direction: true,
		CameraShake: true,
		Sprinting: true,
		SpringCamera: true,
	},

	Attributes: {
		WalkingSpeed: 14,
		SprintingSpeed: 18,
	},

	Tools: {
		Kopis: "Sword",
		Shield: "Shield",
		Sparta: "Shield",
		Athens: "Shield",
	},
};

export = Config;
