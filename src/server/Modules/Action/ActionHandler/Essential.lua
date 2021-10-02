local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)

-- Equip & Holster Actions
local function createPlayAnimStartFunction(name)
    return function(Action, tool)
        local limb = tool.DefaultHandler[name .. "Limb"]
        local character = tool.Character
        local bodyPart = character:FindFirstChild(limb)

        if tool.BaseAnimation then tool.BaseAnimation:Stop() end
        tool.Motor6D.Part0 = bodyPart
        if tool.Config.Animations["Init" .. name] then
            tool.BaseAnimation = Action.playAnim(character, tool.Config.Animations["Init" .. name])
            tool.BaseAnimation.Stopped:wait()
            if not tool.Character then return end -- tool is not active
        end
        tool.BaseAnimation = Action.playAnim(character, tool.Config.Animations[name], {Looped = true})
        if name == "Equip" then tool:ChangeState(name .. "ped") else
            tool:ChangeState(name .. "ed")
        end
        
        Action:End()
    end
end

local HolsterAction = Action.new("Holster",createPlayAnimStartFunction("Holster"))
local EquipAction = Action.new("Equip",createPlayAnimStartFunction("Equip"))

-- Setup Action
local function StartSetup(Action, tool)
    local model = tool.Instance

    local upperTorso = tool.Character.UpperTorso
    local bodyAttach = model.BodyAttach

    local Motor6D = Instance.new("Motor6D")
    Motor6D.Name = model.Name .. "Grip"
    Motor6D.Part0 = upperTorso
    Motor6D.Part1 = bodyAttach
    Motor6D.Parent = model

    tool.Motor6D = Motor6D

    if tool.Config.ActionHandler == "Shield" then
        local BodyAttach = tool.Instance.BodyAttach

        local Blocker = Instance.new("Part")
        Blocker.Name = "Blocker"
        Blocker.Transparency = 1
        Blocker.CanCollide = false
        Blocker.CanTouch = true
        Blocker.Anchored = false
        Blocker.Position = BodyAttach.Position
        Blocker.Size = Vector3.new(1.5,1.5,1.5) -- CONFIG :: BLOCK HITBOX SIZE

        local BlockerWeld = Instance.new("Weld")
        BlockerWeld.Name = "Blocker"
        BlockerWeld.Parent = bodyAttach
        BlockerWeld.Part0 = BodyAttach
        BlockerWeld.Part1 = Blocker

        Blocker.Parent = bodyAttach.Parent
    end

    tool:Queue(HolsterAction:Clone(), Action)
    Action:End()
end

local SetupAction = Action.new("Setup", StartSetup)

return function(EnableButton)
    local Essential = ActionHandler.new({
        ["nil"] = {
            [Enum.UserInputState.None] = {
                [Enum.UserInputState.None] = {Name = "Setup"}
            },
        },
        ["Holstered"] = {
            [Enum.UserInputState.Begin] = {
                [EnableButton] = {Name = "Equip"}
            },
        },
        ["Equipped"] = {
            [Enum.UserInputState.Begin] = {
                [EnableButton] = {Name = "Holster"}
            },
        },
    })
    
    Essential:StoreAction(SetupAction)
    Essential:StoreAction(HolsterAction)
    Essential:StoreAction(EquipAction)
    
    return Essential
end


