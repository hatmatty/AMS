local ServerScriptService = game:GetService("ServerScriptService")
local Knit = require(game:GetService("ReplicatedStorage").Knit)

local CameraDirectionController = Knit.CreateController { Name = "CameraDirectionController" }
local RemoteCameraDirection = Knit.GetService("ClientInfo").CameraDirection


function CameraDirectionController:KnitStart()
    
end


function CameraDirectionController:KnitInit()
    
end


return CameraDirectionController