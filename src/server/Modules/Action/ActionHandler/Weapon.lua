local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)
local Essential = require(script.Parent.Essential)
local Shield = require(script.Parent.Shield)
local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)
local SoundService = game:GetService("SoundService")
local Config = require(game:GetService("ReplicatedStorage").Config)
local Particles = game:GetService("ReplicatedStorage").Particles
local Sounds = game:GetService("ReplicatedStorage").Sounds
local Signal = require(Knit.Util.Signal)
local Timer = require(Knit.Util.Timer)
local ClientCast = require(script.Parent.Parent.Parent.ClientCast)
local Component = require(Knit.Util.Component)
local Tool = Component.FromTag("Tool")

local Weapon = ActionHandler.new({
    ["Equipped"] = {
        [Enum.UserInputState.Begin] = {
            [Enum.UserInputType.MouseButton1] = {Name = "Draw"}
        },
    },
    ["Drawing"] = {
        [Enum.UserInputState.End] = {
            [Enum.UserInputType.MouseButton1] = {Name = "Release"}
        },
    },
})
setmetatable(Weapon, Essential(Enum.KeyCode.One))

Weapon.EquipLimb = "RightHand"
Weapon.HolsterLimb = "LowerTorso"

local BlockOverideHandler = ActionHandler.new({
    ["Equipped"] = { 
        [Enum.UserInputState.End] = {
            [Enum.UserInputType.MouseButton2] = {Name = "DenyResume"}
        },
        [Enum.UserInputState.Begin] = {
            [Enum.UserInputType.MouseButton2] = {Name = "Resume"}
        }
    }
})

BlockOverideHandler:StoreAction(Action.new("DenyResume", function(Action, tool) tool.ResumeBlock = nil end))
BlockOverideHandler:StoreAction(Action.new("Resume", function(Action, tool) tool.ResumeBlock = true end))

function StartDraw(Action, tool)
    tool:ChangeState("Drawing")
    local BaseDamage = 15
    local dmgInterval = 1
    local maxDmg = 50

    for _,sibling in pairs(tool.Siblings) do
        if sibling.Config.ActionHandler == "Shield" then
            sibling.ResumeBlock = nil
            if Action.LockedShield then error("more than 1 shield is equipped") end

            if sibling.Actions["Block"] then 
                sibling.ResumeBlock = true 
                sibling.Actions["Block"]:End() 
            end

            Action.LockedShield = sibling
            Action.UnlockSignal = Signal.new()

            sibling:Lock(Action.UnlockSignal, BlockOverideHandler)
        end
    end

    Action.Direction = tool.CameraDirections[tool.Player]
    if not Action.Direction then error("direction required") end

    if Action.Direction == "Up" then
        Action.Direction = "Stab"
    elseif Action.Direction == "Down" then
        if tool.PastDirection == "Right" then
            Action.Direction = "Left"
        else
            Action.Direction = "Right"
        end
        tool.PastDirection = Action.Direction
    end

    Action.Animation = Action.playAnim(tool.Character, tool.Config.Animations["Draw" .. Action.Direction])
    Action.Stopped = Action.Animation.Stopped:Connect(function()
        Action.Animation:Play(nil,nil,0)
        Action.Animation.TimePosition = Action.Animation.Length-0.001
    end)

    Action.Ticker = Timer.new(0.025)

    local ticks = 0
    Action.Damage = BaseDamage
    Action.Timer = Action.Ticker.Tick:Connect(function()
        Action.Damage += dmgInterval
        ticks += 1
        if ticks >= (maxDmg-BaseDamage)/dmgInterval then
            Action.Ticker:Stop()
        end
    end)

    Action.Ticker:Start()
end

function EndDraw(Action, tool)
    Action.Ticker:Destroy()
    Action.Timer:Disconnect()
    Action.Stopped:Disconnect()
    Action.Animation:Stop()
    -- destroy references to objects
    Action.LockedShield = nil
    Action.UnlockSignal = nil
end

Weapon:StoreAction(Action.new("Draw", StartDraw, EndDraw))

function EmitGore(part: BasePart)
    -- ensure part has blood particles
    if not part:FindFirstChild("Blood1") then
        local new1 = Particles["Blood1"]:Clone()
        local new2 = Particles["Blood2"]:Clone()
        local new3 = Particles["Blood3"]:Clone()

        new1.Parent = part
        new2.Parent = part
        new3.Parent = part
    end 

    part["Blood1"]:Emit(1,15)
    part["Blood2"]:Emit(1,30)
    part["Blood3"]:Emit(1,30)
end

function EmitSparks(part: BasePart)
    if not part:FindFirstChild("SparkEmitter") then
        local new1 = Particles["SparkEmitter"]:Clone()

        new1.Parent = part
    end 

    part["SparkEmitter"]:Emit(5,15)
end

local function Stun(Character, direction)
    Action.playAnim(Character, Config.StunnedAnimations["Stun" .. direction])
end

local function PlaySound(part: BasePart, soundType: string)
    local soundFolder: Folder = Sounds:WaitForChild(soundType)
    local sound = soundFolder[soundType .. math.random(1,#soundFolder:GetChildren())]
    local newSound = sound:Clone()
    newSound.Parent = part
    newSound:Play()
    coroutine.resume(coroutine.create(function()
		wait(newSound.TimeLength)
		newSound:Destroy()
	end))
end


function ReleaseStart(Action, tool)
    tool:ChangeState("Releasing")
    PlaySound(tool.Instance.DmgPart, "Swing")
    Network:FireClient(tool.Player, "Swing")

    local DrawAction = tool.Actions["Draw"]
    local Damage = DrawAction.Damage
    local Direction = DrawAction.Direction
    Action.UnlockSignal = DrawAction.UnlockSignal
    Action.LockedShield = DrawAction.LockedShield

    local raycastParams = RaycastParams.new()
    raycastParams.FilterType = Enum.RaycastFilterType.Blacklist
    raycastParams.FilterDescendantsInstances = {tool.Character}

    if not tool.DmgPointsCreated then
        tool.DmgPointsCreated = true
        local AttachmentName = ClientCast.Settings.AttachmentName

        local Start = tool.Instance.DmgPart.Start
        Start.Name = AttachmentName

        local End = tool.Instance.DmgPart.End
        End.Name = AttachmentName

        for i = Start.Position.Y,End.Position.Y,.1 do
            local attachment = Instance.new("Attachment", tool.Instance.DmgPart)
            attachment.Name = AttachmentName
            attachment.Position = Vector3.new(0,i,0)
        end
    end

    local db = {}

    Action.Caster = ClientCast.new(tool.Instance.DmgPart, raycastParams)
    Action.ToolConnection = Action.Caster.Collided:Connect(function(result)
        local hit = result.Instance
        if db[hit] then return end
        db[hit] = true

        if hit.Name == "Blocker" then
            local shield = Tool:GetFromInstance(hit.Parent)
            if shield then
                if shield.State == "Blocking" then
                    Action.Animation:Stop()
                    Stun(tool.Character, Direction)
                    EmitSparks(tool.Instance.DmgPart)
                    PlaySound(tool.Instance.DmgPart, "Blocked")
                end
            end
        end
    end)

    Action.HumanoidConnection = Action.Caster.HumanoidCollided:Connect(function(result, hitHumanoid)
        if db[hitHumanoid] then return end
        db[hitHumanoid] = true

        tool:Damage(hitHumanoid, Damage)
        PlaySound(tool.Instance.DmgPart, "Hit")
        if Config.Gore then
            EmitGore(tool.Instance.DmgPart)
        end
        Stun(hitHumanoid.Parent, Direction)
    end)

    Action.Caster:Start()
    Action.Animation = Action.playAnim(tool.Character, tool.Config.Animations["Release" .. Direction])
    DrawAction:End()

    Action.Animation.Stopped:Connect(function()
        Action:End()
    end)
end

function ReleaseEnd(Action, tool)
    tool:ChangeState("Equipped")
    Action.Animation:Destroy()
    Action.ToolConnection:Disconnect()
    Action.HumanoidConnection:Disconnect()
    Action.Caster:Destroy()
    if Action.LockedShield then 
        Action.UnlockSignal:Fire() 
        Action.UnlockSignal:Destroy() 
        if Action.LockedShield.ResumeBlock then
            Action.LockedShield:Queue(Shield.Actions.Block:Clone(), Action)
        end
        Action.LockedShield = nil
    end
end

Weapon:StoreAction(Action.new("Release", ReleaseStart, ReleaseEnd))

return Weapon
