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
        self:DestroyToolInput(toolId, ...)
    end
    
end

function ToolController:CreateToolInput(toolId: string, inputs: table)
    for _, inputInfo in pairs(inputs) do
        local InputState = inputInfo.inputState

        ContextActionService:BindAction(
            toolId .. inputInfo.actionName,
            function(actionName, inputState, inputObject)
                if inputState ~= InputState then return end
                
                local inputToSend = inputObject.KeyCode
                if inputToSend == Enum.KeyCode.Unknown then
                    inputToSend = inputObject.UserInputType
                end
                
                ToolInput:Fire(toolId,inputState,inputToSend)
            end, 
            true,
            inputInfo.inputObject)
    end
end


function ToolController:DestroyToolInput(toolId: string, inputs: table)
    for _,inputInfo in pairs(inputs) do
        ContextActionService:UnbindAction(toolId .. inputInfo.actionName)
    end
end



return ToolController