local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)
local Essential = require(script.Parent.Essential)
local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)
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
setmetatable(Weapon, Essential)

local BlockOverideHandler = ActionHandler.new(Action.new("StopBlock", function(Action)
    
end))

local InputInfo = {
    [Enum.UserInputState.End] = {
        [Enum.UserInputType.MouseButton2] = {Name = "StopBlock"}
    }
}

BlockOverideHandler.InputInfo = {["Drawing"] = InputInfo, ["Release"] = InputInfo}

function StartDraw(Action, tool)
    tool:ChangeState("Drawing")
    local BaseDamage = 20
    local dmgInterval = 1

    for _,sibling in pairs(tool.Siblings) do
        if sibling.Config.ActionHandler == "Shield" then
            if Action.LockedShield then error("more than 1 shield is equipped") end

            if sibling.Actions["Block"] then sibling.Actions["Block"]:End() end

            Action.LockedShield = true
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

    print(Action.Direction)

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
        if ticks >= (100-BaseDamage)/dmgInterval then
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
end

Weapon:StoreAction(Action.new("Draw", StartDraw, EndDraw))



function ReleaseStart(Action, tool)
    tool:ChangeState("Releasing")

    local DrawAction = tool.Actions["Draw"]
    local Damage = DrawAction.Damage
    local Direction = DrawAction.Direction
    Action.UnlockSignal = DrawAction.UnlockSignal

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

        if hit.Parent:IsA("Model") then
            local hitTool = Tool:GetFromInstance(hit.Parent)
            if hitTool then 
                if hitTool.Config.ActionHandler == "Shield" then
                    
                end
            end
        end
    end)

    
    Action.HumanoidConnection = Action.Caster.HumanoidCollided:Connect(function(result, hitHumanoid)
        if db[hitHumanoid] then return end
        db[hitHumanoid] = true

        print(hitHumanoid, Damage)
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
    if Action.UnlockSignal then Action.UnlockSignal:Fire() Action.UnlockSignal:Destroy() end
end

Weapon:StoreAction(Action.new("Release", ReleaseStart, ReleaseEnd))

return Weapon
