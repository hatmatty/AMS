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
local Janitor = require(Knit.Util.Janitor)
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

-- an action handler with no actions
local NilHandler = ActionHandler.new({})

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

    local Direction = tool.CameraDirections[tool.Player]
    if not Direction then error("direction required") end

    if Direction == "Up" then
        Direction = "Stab"
    elseif Direction == "Down" then
        if tool.PastDirection == "Right" then
            Direction = "Left"
        else
            Direction = "Right"
        end
        tool.PastDirection = Direction
    end
    Action.Direction = Direction

    if not tool["Attack" .. Direction] then
        tool["Attack" .. Direction] = Action.playAnim(tool.Character, tool.Config.Animations[Direction])
        tool.AttackAnimation = tool["Attack" .. Direction]
    else
        tool.AttackAnimation = tool["Attack" .. Direction]
        tool.AttackAnimation:Play()
    end
    
    Action._janitor:Add(tool.AttackAnimation:GetMarkerReachedSignal("DrawEnd"):Connect(function()
        tool.AttackAnimation:AdjustSpeed(0)
    end))

    local Ticker = Timer.new(0.025)

    local ticks = 0
    Action.Damage = BaseDamage

    local Tick = Ticker.Tick:Connect(function()
        Action.Damage += dmgInterval
        ticks += 1
        if ticks >= (maxDmg-BaseDamage)/dmgInterval then
            Ticker:Stop()
        end
    end)

    Action._janitor:Add(Tick)
    Action._janitor:Add(Ticker)

    Ticker:Start()
end

function EndDraw(Action, tool)
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

local function Stun(Character, direction, shouldLockTools)
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

    local Caster = ClientCast.new(tool.Instance.DmgPart, raycastParams)
    Action._janitor:Add(Caster)

    Action._janitor:Add(Caster.Collided:Connect(function(result)
        local hit = result.Instance
        if db[hit] then return end
        db[hit] = true

        if hit.Name == "Blocker" then
            local shield = Tool:GetFromInstance(hit.Parent)
            if shield then
                if shield.State == "Blocking" then
                    Caster:Stop()
                    Stun(tool.Character, Direction)
                    -- THIS IS DONE SO THAT THE ATTACK DOES NOT END AND WAITS FOR IT TO FINISH ITS STUN
                    local UnlockSignal = Signal.new()
                    tool:Lock(UnlockSignal,NilHandler)
                    tool.AttackAnimation:AdjustWeight(0)
                    tool.AttackAnimation:AdjustSpeed(0)

                    Network:FireClient(tool.Player, "Blocked")
                    EmitSparks(tool.Instance.DmgPart)
                    PlaySound(tool.Instance.DmgPart, "Blocked")

                    wait(0.4)
                    UnlockSignal:Fire()
                    tool.AttackAnimation:Stop()
                    
                end
            end
        end
    end))

    Action._janitor:Add(Caster.HumanoidCollided:Connect(function(result, hitHumanoid)
        if db[hitHumanoid] then return end
        db[hitHumanoid] = true

        tool:Damage(hitHumanoid, Damage)
        PlaySound(tool.Instance.DmgPart, "Hit")
        if Config.Gore then
            EmitGore(tool.Instance.DmgPart)
        end

        -- disbale their attack because they should be stunned!
        for _,v in pairs(hitHumanoid.Parent:GetChildren()) do
            if v:IsA("Model") then
                local tool = Tool:GetFromInstance(v)
                if tool then
                    if tool.State == "Drawing" then
                        local DrawAction = tool.Actions["Draw"]
                        local LockedShield = DrawAction.LockedShield
                        local UnlockSignal = DrawAction.UnlockSignal
                        tool:ChangeState("Equipped")
                        UnlockShield(DrawAction, LockedShield, UnlockSignal)
                        DrawAction:End()
                        tool.AttackAnimation:Stop()
                    elseif tool.State == "Releasing" then
                        tool.Actions["Release"]:End()
                    end
                end
            end
        end
        
        Stun(hitHumanoid.Parent, Direction)
    end))


    Caster:Start()
    DrawAction:End()

    tool.AttackAnimation.TimePosition = 5
    tool.AttackAnimation:AdjustSpeed(1)
    
    Action._janitor:Add(tool.AttackAnimation.Stopped:Connect(function()
        Action:End()
    end))
end

function UnlockShield(action, shield, signal)
    if shield then 
        signal:Fire() 
        signal:Destroy() 
        if shield.ResumeBlock then
            shield:Queue(Shield.Actions.Block:Clone(), action)
        end
    end
end

local function ReleaseEnd(Action, tool)
    tool:ChangeState("Equipped")
    tool.AttackAnimation:Stop()

    UnlockShield(Action, Action.LockedShield, Action.UnlockSignal)
end


Weapon:StoreAction(Action.new("Release", ReleaseStart, ReleaseEnd))

return Weapon
