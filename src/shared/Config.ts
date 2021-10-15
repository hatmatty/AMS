// these are taken out of the config because other entries in the config to acces them, and the config can not refer to itself in its declaration

// ANIMATIONS:
const WeaponAnims = {
	Left: 7632564332,
	Right: 7632959453,
	Stab: 7632993927,

	Holster: 7566107081,
	Equip: 7532918137,
};

const ShieldAnims = {
	Block: 7566699306,

	Holster: 7566057875,
	Equip: 7566034212,
};

// DEFAULT TOOLS:
const ShieldTool = {
	Tag: "Shield",
	Animations: ShieldAnims,
};

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

		Weapon: WeaponAnims,

		Shield: ShieldAnims,
	},

	Elements: {
		Gore: true,
		Rotation: true,
		CameraShake: true,
		Sprinting: true,
		SpringCamera: true,
	},

	Attributes: {
		WalkingSpeed: 14,
		SprintingSpeed: 18,
	},

	Tools: {
		Kopis: {
			Tag: "Weapon",
			Animations: WeaponAnims,
		},
		Shield: ShieldTool,
		Sparta: ShieldTool,
		Athens: ShieldTool,
	},
};

export = Config;
