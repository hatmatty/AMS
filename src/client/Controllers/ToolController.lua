-- ToolService

--[[

    ToolController:ManageToolInput(command: string, tool: Model, ...)

    ToolController:CreateToolInput(tool: Model, inputs: table)

    ToolController:DeleteToolInput(tool: Model, inputs: table)

    ToolController:DestroyToolInput(tool: Model)

--]]


local Knit = require(game:GetService("ReplicatedStorage").Knit)

local ContextActionService = game:GetService("ContextActionService")

local ToolInput
local Actions = {}

local ToolController = Knit.CreateController { Name = "ToolController" }

function ToolController:KnitInit()
    -- None
end

function ToolController:KnitStart()
    local ToolService = Knit.GetService("ToolService")
    ToolInput = ToolService.ToolInput
    ToolInput:Connect(function(...) self:ManageToolInput(...) end)
end

function ToolController:ManageToolInput(toolId: string, command: string, ...)
    if not Actions[toolId] then Actions[toolId] = {} end
    
    if command == "Create" then
        self:CreateToolInput(toolId, ...)
    elseif command == "Delete" then
        self:DeleteToolInput(toolId, ...)
    elseif command == "Destroy" then
        self:DestroyToolInput(toolId)
    end
    
end

function ToolController:CreateToolInput(toolId: string, inputs: table)
    for _, inputInfo in pairs(inputs) do
        local InputState = inputInfo.inputState

        ContextActionService:BindAction(
            toolId .. inputInfo.actionName,
            function(actionName, inputState, inputObject)
                if inputState ~= InputState then return end
                ToolInput:Fire(toolId,inputState,inputObject.KeyCode)
            end, 
            true,
            inputInfo.inputObject)
    end
end

function ToolController:DeleteToolInput(toolId: string, inputs: table)
    for InputState,inputInfo in pairs(inputs) do
        for InputObject,ActionName in pairs(inputInfo) do
            ContextActionService:UnbindAction(toolId .. ActionName)
        end
    end
end


function ToolController:DestroyToolInput(toolId: string)
    local inputs = {}
    for inputName,_ in pairs(Actions[toolId]) do
        local newTable = {}
        newTable.Name = inputName
        table.insert(inputs, newTable)
    end
    self:DeleteToolInput(toolId, inputs)
end



return ToolController