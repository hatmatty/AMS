local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Action = require(script.Parent)
local Helper = require(script.Parent.Parent.Helper)

local Essential = {}
Essential.__index = Essential

function Essential.GetAvaliableInputs(tool) : table
    local avaliableInputs = {
        [tool.State == "Holstered"] = {
            [Enum.KeyCode.One] = {Name = "Equip"}
        },
        [tool.State == "Equipped"] = {
            [Enum.KeyCode.One] = {Name = "Holster"}
        }
    }
    return avaliableInputs[true] or {}
end

---@diagnostic disable-next-line: undefined-type
function Essential.Input(tool: Tool, inputState: EnumItem, inputObject: EnumItem) : Action
    local inputInfo = {
        [tool.State == nil] = {
            [Enum.UserInputState.None] = {
                [Enum.UserInputState.None] = Essential.Setup
            },
        },
        [tool.State == "Holstered"] = {
            [Enum.UserInputState.Begin] = {
                [Enum.KeyCode.One] = Essential.Equip
            },
        },
        [tool.State == "Equipped"] = {
            [Enum.UserInputState.Begin] = {
                [Enum.KeyCode.One] = Essential.Holster
            },
        },
    }

    return inputInfo[true] and inputInfo[true][inputState] and inputInfo[true][inputState][inputObject] and inputInfo[true][inputState][inputObject]:Clone()
end

-- Setup Action
function StartSetup(Action, calledBy)
    local tool = Action.PrimaryTool
    local model = tool.Instance

    local character = tool.Character
    local upperTorso = tool.Character.UpperTorso
    local bodyAttach = model.BodyAttach
    
    local Motor6D = Instance.new("Motor6D")
    Motor6D.Name = model.Name .. "Grip"
    Motor6D.Part0 = upperTorso
    Motor6D.Part1 = bodyAttach
    Motor6D.Parent = upperTorso
    tool.PlayerJanitor:Add(Motor6D)
    
    Action.Motor6D = Motor6D
    Action.Animation = Helper.playAnim(character, tool.Config.Animations.Holster, {Looped = true})
    
    tool.State = "Holstered"
    Action:Destroy()
end

-- action cannot be stopped/destroyed... Action:Destroy() is only called to fire the destroy signal
function StopSetup(Action, calledBy) end
function DestroySetup(Action, calledBy) end

Essential.Setup = Action.new("Setup", StartSetup, StopSetup, DestroySetup)

-- Holster Action
function StartHolster(Action, calledBy)
    
end

function StopHolster(Action, calledBy)

end

function DestroyHolster(Action, calledBy)

end

Essential.Holster = Action.new("Holster", StartHolster, StopHolster, DestroyHolster)

-- Equip Action
function StartEquip(Action, calledBy)
    
end

function StopEquip(Action, calledBy)

end

function DestroyEquip(Action, calledBy)

end

Essential.Equip = Action.new("Equip", StartEquip, StopEquip, DestroyEquip)

return Essential