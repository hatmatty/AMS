local ContextActionService = game:GetService("ContextActionService")
local Helper = require(script.Parent.Parent.Helper)

local ActionHandler = {}
ActionHandler.__index = ActionHandler

function ActionHandler.new()
    local self = {}
    setmetatable(self, ActionHandler)
    self.Actions = {}
    self.__index = self -- incase the actionhandler is inherited from
    return self
end

function ActionHandler:StoreAction(Action)
    self.Actions[Action.Name] = Action
end


function ActionHandler:GetAction(state: string, InputState: EnumItem, InputObject: EnumItem)
    if not state then state = "nil" end -- tables cannot have nil indexes
    local ActionName = self.InputInfo[state] and self.InputInfo[state][InputState] and self.InputInfo[state][InputState][InputObject]
    if ActionName then
        return self.Actions[ActionName]:Clone()
    elseif getmetatable(self) ~= ActionHandler then
        return getmetatable(self):GetAction(state, InputState, InputObject)
    end
end

function ParseInput(AvaliableInputs)
    local new = {}
    for inputState,inputInfo in pairs(AvaliableInputs) do  
        for inputObject,actionName in pairs(inputInfo) do
            table.insert(new, {actionName = actionName, inputObject = inputObject, inputState = inputState})
        end
    end
    return new
end

function ActionHandler:GetAvaliableInputs(state: string) : table
    local AvaliableInputs = self.InputInfo[state] or {}
    AvaliableInputs = ParseInput(AvaliableInputs)
    if getmetatable(self) ~= ActionHandler then
        return Helper.CombineTables(AvaliableInputs, getmetatable(self):GetAvaliableInputs(state))
    else
        return AvaliableInputs
    end
end

return ActionHandler