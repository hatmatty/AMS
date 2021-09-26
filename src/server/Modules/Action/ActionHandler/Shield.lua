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
    print("started")
    tool:ChangeState("Blocking")

    Action.BlockAnimation = Action.playAnim(tool.Character, tool.Config.Animations.Block, {Looped = true, fadeTime = 0.4})
end

local function EndBlock(Action, tool)
    Action.BlockAnimation.Looped = false
    Action.BlockAnimation:Stop(0.2)

    tool:ChangeState("Equipped")
    print("Destroyed")
end

Shield:StoreAction(Action.new("Block", StartBlock, EndBlock))

local function StopBlock(Action, tool) tool.Actions["Block"]:End() end
Shield:StoreAction(Action.new("StopBlock", StopBlock))

return Shield