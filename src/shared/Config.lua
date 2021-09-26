local Config = {}

Config.StunnedAnimations = {
	StunStab =7129179801,
	StunLeft = 7129183472,
	StunRight = 7129034287,
}

local DefaultWeaponAnims = {
	-- Weapon
	DrawLeft = 7563073150,
	DrawRight = 7561804876,
	DrawStab = 7566841005,

	ReleaseLeft = 7563124930,
	ReleaseRight = 7562183296, 
	ReleaseStab = 7571425026,

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

Config.Tools = {
	["Test"] = {
		ActionHandler = "Weapon",
		Animations = DefaultWeaponAnims
	},
	["Test2"] = {
		ActionHandler = "Shield",
		Animations = DefaultShieldAnims,
	}
}

return Config
