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

function ToolController:ManageToolInput(tool: Model, command: string, ...)
    if command == "Create" then
        self:CreateToolInput(tool, ...)
    elseif command == "Delete" then
        self:DeleteToolInput(tool, ...)
    elseif command == "Destroy" then
        self:DestroyToolInput(tool)
    end
end

function ToolController:CreateToolInput(tool: Model, inputs: table)
    for _,inputInfo in pairs(inputs) do  -- ex of inputInfo: {Name = "Block", inputTypes = {Enum.UserInputType.MouseButton}}
        -- tool.Name & inputInfo.Name are concacted to allow for duplicating inputs, for instance if a sword and a shield both have a block function, the one which runs should be decided by the tool
        ContextActionService:BindAction(tool.Name .. inputInfo.Name, function(...) ToolInput:Fire(tool, ...) end, true, inputInfo.inputTypes)
        Actions[tool][inputInfo.Name] = true
    end
end

function ToolController:DeleteToolInput(tool: Model, inputs: table)
    for _,inputInfo in pairs(inputs) do -- ex of inputInfo: {Name = "Block"}
        ContextActionService:UnbindAction(tool.Name .. inputInfo.Name)
    end
end


function ToolController:DestroyToolInput(tool: Model)
    if not Actions[tool] then warn("Something might have gone wrong...") end
    local inputs = {}
    for inputName,_ in pairs(Actions[tool]) do
        local newTable = {}
        newTable.Name = inputName
        table.insert(inputs, newTable)
    end
    self:DeleteToolInput(tool, inputs)
end



return ToolController