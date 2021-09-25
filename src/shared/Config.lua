local Config = {}

local DefaultWeaponAnims = {
	-- Weapon
	DrawLeft = 7563073150,
	DrawRight = 7561804876,
	DrawStab = 7563184716,

	ReleaseLeft = 7563124930,
	ReleaseRight = 7562183296, 
	ReleaseStab = 7563381598,

	-- Essential 
	--InitHolster = 7554818252,
	Holster = 7500633842,
	--InitEquip = 7554827098,
	Equip = 7532918137,
}

Config.Tools = {
	["Test"] = {
		ActionHandler = "Weapon",
		Animations = DefaultWeaponAnims
	}
}

return Config
