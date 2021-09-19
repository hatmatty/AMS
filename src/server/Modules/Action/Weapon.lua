local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Action = require(script.Parent)
local Essential = require(script.Parent.Essential)
local Helper = require(script.Parent.Parent.Helper)

local Weapon = {}
Weapon.__index = Weapon
setmetatable(Weapon, Essential)

function Weapon.GetAvaliableInputs(tool)
    local avaliableInputs = {
        [tool.State == "Equipped"] = {
            [Enum.UserInputType.MouseButton1] = {Name = "Swing"}
        }
    }
    return Helper.CombineTables(avaliableInputs[true] or {}, Essential.GetAvaliableInputs(tool))
end

function Weapon.Input(tool, inputState, inputObject)
    local inputInfo = {
        [tool.State == "Equipped"] = {
            [Enum.UserInputState.Begin] = {
                [Enum.UserInputType.MouseButton1] = Weapon.Swing
            },
        },
    }
    
    return (inputInfo[true] and inputInfo[true][inputState] and inputInfo[true][inputState][inputObject] 
            and inputInfo[true][inputState][inputObject]:Clone()) or Essential.Input(tool, inputState, inputObject)
end

-- Swing Action
function StartSwing(Action, calledBy)
    
end

function StopSwing(Action, calledBy)

end

function DestroySwing(Action, calledBy)

end

Weapon.Swing = Action.new("Swing", StartSwing, StopSwing, DestroySwing)

return Weapon