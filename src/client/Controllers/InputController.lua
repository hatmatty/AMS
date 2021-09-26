local UserInputService = game:GetService("UserInputService")

local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)

local ContextActionService = game:GetService("ContextActionService")

local InputController = Knit.CreateController { Name = "InputController" }

function InputController:KnitInit()
    -- None
end

local function createInputEvent(event, inputState)
    event:Connect(function(input,gameProcessedEvent)
        if gameProcessedEvent then return end
        local inputToSend 
        if input.UserInputType == Enum.UserInputType.Keyboard then
            inputToSend = input.KeyCode
        else
            inputToSend = input.UserInputType
        end

        Network:FireServer("Input", inputState,inputToSend)
    end)
end

function InputController:KnitStart()
    createInputEvent(UserInputService.InputBegan, Enum.UserInputState.Begin)
    createInputEvent(UserInputService.InputEnded, Enum.UserInputState.End)
end

-- function ToolController:ManageToolInput(toolId: string, command: string, ...)
--     if command == "Create" then
--         self:CreateToolInput(toolId, ...)
--     elseif command == "Delete" then
--         self:DeleteToolInput(toolId, ...)
--     elseif command == "Destroy" then
--         self:DestroyToolInput(toolId, ...)
--     end
-- end

-- function ToolController:CreateToolInput()

-- end


-- function ToolController:DestroyToolInput()

-- end



return InputController