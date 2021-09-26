local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Config = require(game:GetService("ReplicatedStorage").Config)
local Player = game:GetService("Players").LocalPlayer
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local Spring = require(game:GetService("ReplicatedStorage").Spring)

local SpringCamera = Knit.CreateController { Name = "SpringCamera" }


function SpringCamera:KnitStart()
    if not Config.SpringCamera then return end
    if Player.Character then self:StartCamera() end
    Player.CharacterAdded:Connect(function()
        self:StartCamera()
    end)
    Player.CharacterRemoving:Connect(function()
        self:EndCamera()
    end)
end

function SpringCamera:StartCamera()
    local camera = workspace.CurrentCamera
    local humanoid = Player.Character:WaitForChild("Humanoid")
    local head = Player.Character:WaitForChild("Head")
    local rootPart = Player.Character:WaitForChild("HumanoidRootPart")

    local subject = Instance.new("Part")
    subject.CanCollide = false
    subject.CanTouch = false
    subject.Transparency = 1 
    subject.Size = Vector3.new(0.1,0.1,0.1)
    subject.Anchored = true 
    subject.Parent = Player.Character

    self._janitor:Add(subject)
   
    subject.Position = head.Position
    camera.CameraSubject = subject

    local spring = Spring.new(subject.Position)
    spring.Speed = 60
    spring.Damper = 1

    local function updateSubject()
        if (camera.CFrame.Position - subject.Position).Magnitude < 1 or (camera.CFrame.Position - head.Position).Magnitude < 1 then
            camera.CameraSubject = humanoid
            subject.Position = head.Position
        else
            spring.Target = head.Position
            camera.CameraSubject = subject
            subject.Position = spring.Position

            if UserInputService.MouseBehavior == Enum.MouseBehavior.LockCenter then
                local lookXZ = Vector3.new(camera.CFrame.LookVector.X,0,camera.CFrame.LookVector.Z)
                rootPart.CFrame = CFrame.lookAt(rootPart.Position,rootPart.Position + lookXZ)
            end
        end
    end

    RunService:BindToRenderStep("UpdateSubject", Enum.RenderPriority.Camera.Value, updateSubject)
end

function SpringCamera:EndCamera()
    RunService:UnbindFromRenderStep("UpdateSubject")
    self._janitor:Cleanup()
end


function SpringCamera:KnitInit()
    self._janitor = Janitor.new()
end


return SpringCamera