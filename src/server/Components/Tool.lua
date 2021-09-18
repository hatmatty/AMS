local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local RemoteSignal = require(Knit.Util.Remote.RemoteSignal)
local Signal = require(Knit.Util.Signal)
local Players = game:GetService("Players")
local Config = require(game:GetService("ReplicatedStorage").Config)

local Tools = {}

local Tool = {}
Tool.__index = Tool
Tool.Tag = "Tool"
Tool.ToolInput = Signal.new()



function Tool.handleInput() -- DNT (do not trust) : recieved by client
    Tool.ToolInput:Connect(function(player: Player, toolModel: Model, actionName, inputState: Enum, inputObject: Enum )
        local Tool = Tools[toolModel]
        if Tool and Tool.Player == player then
            assert(typeof(inputObject) == "EnumItem" and typeof(inputState) == "EnumItem")
            Tool:Input(inputState, inputObject) 
        end
    end)
end

function Tool.new(instance)
    
    local self = setmetatable({}, Tool)
    
    self._janitor = Janitor.new()
    self._janitor:Add(instance)

    local ToolConfig = Config.Tools[instance.Name]
    if not ToolConfig then error("tool " .. instance.Name .. " need to be configured") end
    self.Config = ToolConfig
    self.Name = ToolConfig.Name

    -- then find the appropriate module which contains the actions for the tool

    Tools[instance] = self

    return self
    
end


function Tool:Init()
    local character = Players:GetPlayerFromCharacter()
    if character then
        -- setup input and play with character
    elseif Config.Tools.Droppable then
        -- enable tool dropability
    else
        -- destroy
    end
end


function Tool:Deinit()
end


function Tool:Destroy()
    self._janitor:Destroy()
end


Tool.handleInput()

return Tool