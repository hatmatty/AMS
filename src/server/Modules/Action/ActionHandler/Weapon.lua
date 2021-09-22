local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)
local Essential = require(script.Parent.Essential)

local Weapon = ActionHandler.new()
setmetatable(Weapon, Essential)

Weapon.InputInfo = {
    ["Equipped"] = {
        [Enum.UserInputState.Begin] = {
            [Enum.UserInputType.MouseButton1] = {Name = "Swing"}
        },
    },
}

-- Swing Action
function StartSwing(Action)
    
end

function EndSwing(Action)
    
end

Weapon.Swing = Action.new("Swing", StartSwing, EndSwing)

return Weapon
