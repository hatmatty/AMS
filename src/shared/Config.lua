local Config = {}

Config.WalkAnimation = 6492892050

Config.StunnedAnimations = {
	StunStab = 7129179801,
	StunLeft = 7129183472,
	StunRight = 7129034287,
}

local DefaultWeaponAnims = {
	Left = 7632564332,
	Right = 7632959453,
	Stab = 7632993927,

	Holster = 7566107081,
	Equip = 7532918137,
}

local DefaultShieldAnims = {
	Block = 7566699306,
	
	Holster = 7566057875,
	Equip = 7566034212,
}

Config.Gore = true
Config.Rotation = true
Config.CameraShake = true
Config.Sprinting = true
Config.SpringCamera = true

Config.WalkingSpeed = 14
Config.SprintingSpeed = 18

local DefaultShield = {
	ActionHandler = "Shield",
	Animations = DefaultShieldAnims,
}

Config.Tools = {
	["Kopis"] = {
		ActionHandler = "Weapon",
		Animations = DefaultWeaponAnims
	},
	["Shield"] = DefaultShield,
	["Sparta"] = DefaultShield,
	["Athens"] = DefaultShield,
}

return Config
