local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)

local RotationService = Knit.CreateService {
    Name = "RotationService";
    Client = {};
}


function RotationService:KnitStart()
    
end


function RotationService:KnitInit()
    Network:BindEvents({
        UpdateRotation = function(player, waist, neck, leftshoulder, rightshoulder) 
            local character = player.Character
            if not character then error("character needed") end
            
            local Head = character.Head
            local UpperTorso = character.UpperTorso
            local RightUpperArm = character.RightUpperArm
            local LeftUpperArm = character.LeftUpperArm

            local Waist = UpperTorso.Waist
            local Neck = Head.Neck
            local LeftShoulder = LeftUpperArm.LeftShoulder
            local RightShoulder = RightUpperArm.RightShoulder

            Network:FireOtherClientsWithinDistance(player, 20, "UpdateRotation", player, waist, neck, leftshoulder, rightshoulder)
        end
    })
end


return RotationService