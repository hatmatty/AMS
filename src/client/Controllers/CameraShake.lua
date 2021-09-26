local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Config = require(game:GetService("ReplicatedStorage").Config)
local Network = require(game:GetService("ReplicatedStorage").Network)
local CameraShaker = require(script.Parent.Parent.Modules.CameraShaker)

local Camera = game.Workspace.CurrentCamera

local CameraShake = Knit.CreateController { Name = "CameraShake" }

function CameraShake:KnitStart()
    if not Config.CameraShake then return end
    self.camShake = CameraShaker.new(Enum.RenderPriority.Camera.Value+1, function(shakeCFrame)
        Camera.CFrame = Camera.CFrame * shakeCFrame
    end)
    self.camShake:Start()

    local function largeBump() self.camShake:Shake(CameraShaker.Presets.LargeBump) end
    local function bump() self.camShake:Shake(CameraShaker.Presets.Bump) end
    local function smallbump() self.camShake:Shake(CameraShaker.Presets.SmallBump) end

    Network:BindEvents({
        Blocked = largeBump,
        Damaged = largeBump,
        Hit = bump,
        Swing = smallbump,
    })
end


function CameraShake:KnitInit()
    
end


return CameraShake