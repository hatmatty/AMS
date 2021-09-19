local ContextActionService = game:GetService("ContextActionService")
local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Action = require(script.Parent)
local Helper = require(script.Parent.Parent.Helper)

local Essential = {}
Essential.__index = Essential

function Essential.GetAvaliableInputs(tool) : table
    local avaliableInputs = {
        [tool.State == "Holstered"] = {
            {Name = "Equip", inputTypes = {Enum.KeyCode.One}}
        },
        [tool.State == "Equipped"] = {
            {Name = "Holster", inputTypes = {Enum.KeyCode.One}}
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

    local upperTorso = tool.Character.UpperTorso
    local bodyAttach = model.BodyAttach
    
    local Motor6D = Instance.new("Motor6D")
    Motor6D.Name = model.Name .. "Grip"
    Motor6D.Part0 = upperTorso
    Motor6D.Part1 = bodyAttach
    Motor6D.Parent = upperTorso
    tool.PlayerJanitor:Add(Motor6D)
    
    Action.Motor6D = Motor6D
    
    tool:QueueAction(Essential.Holster:Clone(), Action)
    Action:Finish()
end

function CancelSetup(Action, calledBy) 
    local tool = Action.PrimaryTool
    local upperTorso = tool.Character.UpperTorso

    if Action.Motor6D then Action.Motor6D:Destroy()
    else upperTorso:WaitForChild(tool.Instance.Name .. "Grip"):Destroy() end 
end

Essential.Setup = Action.new("Setup", StartSetup, CancelSetup)

function createPlayAnimStartFunction(name)
    return function(Action, calledBy)
        local tool = Action.PrimaryTool
        local character = tool.Character

        if tool.BaseAnimation then tool.EquipAnimation:Stop() end

        if tool.Config.Animations["Init" .. name] then
            tool.BaseAnimation = Helper.playAnim(character, tool.Config.Animations["Init" .. name])
            tool.BaseAnimation.Stopped:wait()
            if not tool.Character then return end -- tool is not active
        end
        tool.BaseAnimation = Helper.playAnim(character, tool.Config.Animations[name], {Looped = true})
        tool.State = name .. "ed"

        Action:Finish()
    end
end

-- Holster Action
StartHolster = createPlayAnimStartFunction("Holster")

Essential.Holster = Action.new("Holster", StartHolster)

-- Equip Action
StartEquip = createPlayAnimStartFunction("Equip")

Essential.Equip = Action.new("Equip", StartEquip)

return Essential