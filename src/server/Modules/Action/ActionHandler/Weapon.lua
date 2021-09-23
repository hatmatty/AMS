local ActionHandler = require(script.Parent)
local Action = require(script.Parent.Parent)
local Essential = require(script.Parent.Essential)

local Weapon = ActionHandler.new()
setmetatable(Weapon, Essential)

Weapon.InputInfo = {
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
}

function StartDraw(Action)
    local tool = Action.PrimaryTool
    
end

function EndDraw(Action)
    local tool = Action.PrimaryTool
    
end

Weapon:StoreAction(Action.new("Draw", StartDraw, EndDraw))

function ReleaseStart(Action)
    local tool = Action.PrimaryTool
    
    
    Action:End()
end

function ReleaseEnd(Action)
    local tool = Action.PrimaryTool
    
end

Weapon:StoreAction(Action.new("Release", ReleaseStart, ReleaseEnd))

return Weapon
