local Config = {}

Config.StunnedAnimations = {
	StunStab =7129179801,
	StunLeft = 7129183472,
	StunRight = 7129034287,
}

local DefaultWeaponAnims = {
	-- Weapon
	DrawRight = 7561804876,
	DrawStab = 7566841005,

	ReleaseRight = 7562183296, 
	ReleaseStab = 7571425026,

	Left = 7632564332,
	Right = 7632959453,
	Stab = 7632993927,

	-- Essential 
	--InitHolster = 7554818252,
	Holster = 7566107081,
	--InitEquip = 7554827098,
	Equip = 7532918137,
}

local DefaultShieldAnims = {
	Holster = 7566057875,
	Equip = 7566034212,
	Block = 7566699306,
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
