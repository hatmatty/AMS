local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)
local Essential = require(script.Parent.Essential)
local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)
local Config = require(game:GetService("ReplicatedStorage").Config)
local Signal = require(Knit.Util.Signal)
local Component = require(Knit.Util.Component)
local Tool = Component.FromTag("Tool")

local Shield = ActionHandler.new({
    ["Equipped"] = {
        [Enum.UserInputState.Begin] = {
            [Enum.UserInputType.MouseButton2] = {Name = "Block"}
        },
    },
    ["Blocking"] = {
        [Enum.UserInputState.End] = {
            [Enum.UserInputType.MouseButton2] = {Name = "StopBlock"}
        },
    },
})
setmetatable(Shield, Essential(Enum.KeyCode.Q))

Shield.EquipLimb = "LeftUpperArm"
Shield.HolsterLimb = "UpperTorso"

local function StartBlock(Action, tool)
    tool:ChangeState("Blocking")
    
    if not tool.Instance:FindFirstChild("Blocker") then
        local bodyAttach = tool.Instance.BodyAttach
        local blocker = Instance.new("Part")
        blocker.Name = "Blocker"
        blocker.Transparency = 1
        blocker.CanCollide = false
        blocker.CanTouch = true
        blocker.Anchored = false
        blocker.Position = bodyAttach.Position
        blocker.Size = Vector3.new(2,2,1) -- CONFIG :: BLOCK HITBOX SIZE

        local BlockerWeld = Instance.new("Weld")
        BlockerWeld.Name = "Blocker"
        BlockerWeld.Parent = bodyAttach
        BlockerWeld.Part0 = bodyAttach
        BlockerWeld.Part1 = blocker

        blocker.Parent = bodyAttach.Parent
    end
    
    Action.BlockAnimation = Action.playAnim(tool.Character, tool.Config.Animations.Block, {Looped = true, fadeTime = 0.4})
end

local function EndBlock(Action, tool)
    Action.BlockAnimation.Looped = false
    Action.BlockAnimation:Stop(0.2)

    tool:ChangeState("Equipped")
end

Shield:StoreAction(Action.new("Block", StartBlock, EndBlock))

local function StopBlock(Action, tool) tool.Actions["Block"]:End() end
Shield:StoreAction(Action.new("StopBlock", StopBlock))

return Shield