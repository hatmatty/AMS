local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)

local Essential = ActionHandler.new()

Essential.InputInfo = {
    ["nil"] = {
        [Enum.UserInputState.None] = {
            [Enum.UserInputState.None] = {Name = "Setup"}
        },
    },
    ["Holstered"] = {
        [Enum.UserInputState.Begin] = {
            [Enum.KeyCode.One] = {Name = "Equip"}
        },
    },
    ["Equipped"] = {
        [Enum.UserInputState.Begin] = {
            [Enum.KeyCode.One] = {Name = "Holster"}
        },
    },
}

-- Setup Action
function StartSetup(Action)
    local tool = Action.PrimaryTool
    local model = tool.Instance

    local upperTorso = tool.Character.UpperTorso
    local bodyAttach = model.BodyAttach

    local Motor6D = Instance.new("Motor6D")
    Motor6D.Name = model.Name .. "Grip"
    Motor6D.Part0 = upperTorso
    Motor6D.Part1 = bodyAttach
    Motor6D.Parent = model

    tool.Motor6D = Motor6D

    tool:Queue(Essential.Actions.Holster:Clone(), Action)
    Action:End()
end

Essential:StoreAction(Action.new("Setup", StartSetup))

function createPlayAnimStartFunction(name, limb)
    return function(Action)
        local tool = Action.PrimaryTool
        local character = tool.Character
        local bodyPart = character:FindFirstChild(limb)

        if tool.BaseAnimation then tool.BaseAnimation:Stop() end

        tool.Motor6D.Part0 = bodyPart
        if tool.Config.Animations["Init" .. name] then
            tool.BaseAnimation = Action._playAnim(character, tool.Config.Animations["Init" .. name])
            tool.BaseAnimation.Stopped:wait()
            if not tool.Character then return end -- tool is not active
        end
        tool.BaseAnimation = Action._playAnim(character, tool.Config.Animations[name], {Looped = true})
        if name == "Equip" then tool:ChangeState(name .. "ped") else
            tool:ChangeState(name .. "ed")
        end
        
        Action:End()
    end
end

-- Holster Action
StartHolster = createPlayAnimStartFunction("Holster", "UpperTorso")

Essential:StoreAction(Action.new("Holster", StartHolster))

-- Equip Action
StartEquip = createPlayAnimStartFunction("Equip", "RightHand")

Essential:StoreAction(Action.new("Equip", StartEquip))

return Essential
