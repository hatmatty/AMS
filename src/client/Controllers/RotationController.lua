local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Timer = require(Knit.Util.Timer)
local Janitor = require(Knit.Util.Janitor)
local Network = require(game:GetService("ReplicatedStorage").Network)
local Config = require(game:GetService("ReplicatedStorage").Config)


local RotationController = Knit.CreateController { Name = "RotationController" }

local Camera = workspace.CurrentCamera
local Player = game:GetService("Players").LocalPlayer

local tweenService = game:GetService("TweenService")

local function CapY(value)
    if value < 0 then
        value = value/3
    end
    return math.min(math.max(value,-0.5),0.5)
end

local function CapX(value)
    return math.min(math.max(value,-0.5),0.5)
end

local function Tween(Part,NewCFrame, time)
    if not time then time = 0.25 end
    tweenService:Create(Part,TweenInfo.new(time,Enum.EasingStyle.Quad,Enum.EasingDirection.Out, 0, false, 0),{C0 = NewCFrame}):Play()
end


function RotationController:KnitStart()
    if not Config.Rotation then return end
    Player.CharacterAdded:Connect(function()
        self:StartRotation()
    end)
    Player.CharacterRemoving:Connect(function()
        self:StopRotation()
    end)

    if Player.Character then self:StartRotation() end
end



function RotationController:StopRotation()
    self.Running = nil
    self._janitor:Cleanup()
end

function RotationController:StartRotation()
    if self.Running then return end -- cannot start 2 rotations
    self.Running = true
    local Character = Player.Character

    local DeadConnection
    DeadConnection = Character:WaitForChild("Humanoid").Died:Connect(function()
        DeadConnection:Disconnect()
        self:StopRotation()
    end)

    local Head = Character:WaitForChild("Head")
    local UpperTorso = Character:WaitForChild("UpperTorso")
    local RightUpperArm = Character:WaitForChild("RightUpperArm")
    local LeftUpperArm = Character:WaitForChild("LeftUpperArm")
    local Root = Character:WaitForChild("HumanoidRootPart")

    local Waist = UpperTorso:WaitForChild("Waist")
    local Neck = Head:WaitForChild("Neck")
    local RightShoulder = RightUpperArm:WaitForChild("RightShoulder")
    local LeftShoulder = LeftUpperArm:WaitForChild("LeftShoulder")

    local NeckYOffset = Neck.C0.Y

    local RightShoulderXOffset = RightShoulder.C0.X
    local RightShoulderYOffset = RightShoulder.C0.Y

    local LeftShoulderXOffset = LeftShoulder.C0.X
    local LeftShoulderYOffset = LeftShoulder.C0.Y

    local CFNew, CFAng = CFrame.new, CFrame.Angles
    local asin = math.asin

    self._janitor:Add(game:GetService("RunService").RenderStepped:Connect(function()
        local factor = 0.8
        
        Head = Character:WaitForChild("Head")
        UpperTorso = Character:WaitForChild("UpperTorso")
        RightUpperArm = Character:WaitForChild("RightUpperArm")
        LeftUpperArm = Character:WaitForChild("LeftUpperArm")
        Root = Character:WaitForChild("HumanoidRootPart")

        Waist = UpperTorso:WaitForChild("Waist")
        Neck = Head:WaitForChild("Neck")
        RightShoulder = RightUpperArm:WaitForChild("RightShoulder")
        LeftShoulder = LeftUpperArm:WaitForChild("LeftShoulder")
        
        self.Enabled = true -- DISABLED THIS OMG
        if not self.Enabled then 
            if CFNew(0, 0, 0) ~= Waist.C0 then Tween(Waist,CFNew(0, 0, 0),0.5) end
            if CFNew(0, NeckYOffset, 0) ~= Neck.C0 then Tween(Neck,CFNew(0, NeckYOffset, 0),0.5) end
            if CFNew(LeftShoulderXOffset, LeftShoulderYOffset, 0) ~= LeftShoulder.C0 then Tween(LeftShoulder,CFNew(LeftShoulderXOffset, LeftShoulderYOffset, 0),0.5) end
            if CFNew(RightShoulderXOffset, RightShoulderYOffset, 0) ~= RightShoulder.C0 then Tween(RightShoulder,CFNew(RightShoulderXOffset, RightShoulderYOffset, 0),0.5) end
            return	
        end

        local CameraDirection = Root.CFrame:toObjectSpace(Camera.CFrame).LookVector	

        if Waist then
            local newCFrame = CFNew(0, 0, 0) * CFAng(0, -asin(CapX(CameraDirection.X/factor)), 0) * CFAng(asin(CapY(CameraDirection.Y/factor)), 0, 0)
            if newCFrame ~= Waist.C0 then Tween(Waist,newCFrame) end	
        end
        if Neck then
            local newCFrame = CFNew(0, NeckYOffset, 0) * CFAng(0, asin(CapX(CameraDirection.X/factor)), 0) * CFAng(-asin(CapY(CameraDirection.Y/factor)), 0, 0)
            if newCFrame ~= Neck.C0 then Tween(Neck,newCFrame) end		
        end
        if LeftShoulder then
            local newCFrame = CFNew(LeftShoulderXOffset, LeftShoulderYOffset, 0) * CFAng(0, -asin(CapX(CameraDirection.X/factor)), 0) * CFAng(asin(CapY(CameraDirection.Y/factor)), 0, 0)
            if newCFrame ~= LeftShoulder.C0 then Tween(LeftShoulder,newCFrame) end		
        end
        if RightShoulder then
            local newCFrame = CFNew(RightShoulderXOffset, RightShoulderYOffset, 0) * CFAng(0, -asin(CapX(CameraDirection.X/factor)), 0) * CFAng(asin(CapY(CameraDirection.Y/factor)), 0, 0)
            if newCFrame ~= RightShoulder.C0 then Tween(RightShoulder,newCFrame) end		
        end
    end))

    self.ticker = Timer.new(0.2, self._janitor)
    self._janitor:Add(self.ticker.Tick:Connect(function()
        Network:FireServer("UpdateRotation", Neck.C0,Waist.C0,LeftShoulder.C0,RightShoulder.C0)
    end))
    self.ticker:StartNow()
end




function RotationController:KnitInit()
    if not Config.Rotation then return end
    self._janitor = Janitor.new()

    Network:BindEvents({
        UpdateRotation = function(otherPlayer, neckCFrame, waistCFrame, leftShoulderCFrame, rightShoulderCFrame)
            local otherCharacter = otherPlayer.Character
            if not otherCharacter then return end
            
            local Neck = otherCharacter:WaitForChild("Head"):FindFirstChild("Neck")
            local Waist = otherCharacter:WaitForChild("UpperTorso"):FindFirstChild("Waist")
            local LeftShoulder = otherCharacter:WaitForChild("LeftUpperArm"):FindFirstChild("LeftShoulder")
            local RightShoulder = otherCharacter:WaitForChild("RightUpperArm"):FindFirstChild("RightShoulder")	
            local TweenTime = 0.1
            if neckCFrame and Neck then
                tweenService:Create(Neck, TweenInfo.new(TweenTime,Enum.EasingStyle.Quad,Enum.EasingDirection.Out, 0, false, 0), {C0 = neckCFrame}):Play()
            end
            if waistCFrame and Waist then
                tweenService:Create(Waist, TweenInfo.new(TweenTime,Enum.EasingStyle.Quad,Enum.EasingDirection.Out, 0, false, 0), {C0 = waistCFrame}):Play()
            end
            if leftShoulderCFrame and LeftShoulder then
                tweenService:Create(LeftShoulder, TweenInfo.new(TweenTime,Enum.EasingStyle.Quad,Enum.EasingDirection.Out, 0, false, 0), {C0 = leftShoulderCFrame}):Play()
            end
            if rightShoulderCFrame and RightShoulder then
                tweenService:Create(RightShoulder, TweenInfo.new(TweenTime,Enum.EasingStyle.Quad,Enum.EasingDirection.Out, 0, false, 0), {C0 = rightShoulderCFrame}):Play()
            end
        end
    })
    
end


return RotationController