local ServerScriptService = game:GetService("ServerScriptService")
local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)

local CameraDirection = Knit.CreateController { Name = "CameraDirectionController" }

function CameraDirection:KnitStart()
    game:GetService("RunService").Heartbeat:Connect(function()
        local x,y,z = self.Camera.CFrame:ToOrientation()
        if self.prevX ~= x and math.abs(self.prevX-x) >= 0.03 then
            local currentDirection
            if self.prevX < x then
                currentDirection = "Down"
            elseif self.prevX > x then
                currentDirection = "Up"
            end

            if currentDirection ~= self.Direction then
                if self.Beats then self.Beats += 1 else self.Beats = 1 end
                if self.Beats > 3 then -- has been moving in a new direction for 20 heartbeats
                    self.Beats = 0
                    self.Direction = currentDirection
                    Network:FireServer("CameraDirection", self.Direction)
                end
            else
                if self.Beats and self.Beats > 0 then self.Beats -= 1 end -- they moved in current direction
            end
        end
        self.prevX = x
    end)
end


function CameraDirection:KnitInit()
    self.Camera = game.Workspace.CurrentCamera
    self.Direction = "Down"
    Network:FireServer("CameraDirection", self.Direction)
    local x,y,z = self.Camera.CFrame:ToEulerAnglesXYZ()
    self.prevX = x
end


return CameraDirection