local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Config = require(game:GetService("ReplicatedStorage").Config)
local Janitor = require(Knit.Util.Janitor)
local Component = require(Knit.Util.Component)
local Signal = require(Knit.Util.Signal)
local RemoteSignal = require(Knit.Util.Remote.RemoteSignal)

local Players = game:GetService("Players")

local Actions = script.Parent.Parent.Modules.Action

local Tools = {}

local Tool = {}
Tool.__index = Tool
Tool.Tag = "Tool"
Tool.ToolInput = Signal.new()


function Tool.new(instance)

    local self = setmetatable({}, Tool)

    self._janitor = Janitor.new()
    self._janitor:Add(instance)

    self.Config = Config.Tools[instance.Name]
	if not self.Config then error("tool " .. instance.Name .. " need to be configured") end

    self.Name = self.Config.Name
    self.ActionPack = require(Actions:FindFirstChild(self.Config.ActionPack))

    -- then find the appropriate module which contains the actions for the tool

    Tools[instance] = self

    return self

end


function Tool:Init()
    local player = Players:GetPlayerFromCharacter(self.Instance.Parent)

    if player then self:CharacterSetup(player)
    elseif Config.Tools.Droppable then self:DroppableSetup() 
    else self:Destroy() end
end

function Tool:CharacterSetup(player: Player) -- setup tool for usage as a child of a character
    self.PlayerJanitor = Janitor.new() 
    self._janitor:Add(self.PlayerJanitor)

    self.StateChanged = Signal.new()
    self.PlayerJanitor:Add(self.StateChanged)

    self.Player = player
    self.Character = self.Instance.Parent

    self:ManageSiblings()
    self:ManageInputs()

    self.Actions = {}
    self:Input(Enum.UserInputState.None,Enum.UserInputState.None)
end

function Tool:ManageInputs()
    self.Inputs = {}
    self.StateChanged:Connect(function()
        local updatedInputs = self.ActionPack.GetAvaliableInputs(self)
    end)
end

function Tool:ManageSiblings()
    -- WIP!!
    self.Siblings = {}
end

function Tool:CharacterDestroy()
    self.PlayerJanitor:Destroy()
end

function Tool.handleInput() -- DNT (do not trust) : recieved by client
    Tool.ToolInput:Connect(function(player: Player, toolModel: Model, actionName, inputState: Enum, inputObject: Enum )
        local Tool = Tools[toolModel]
        if Tool and Tool.Player == player then
            assert(typeof(inputObject) == "EnumItem" and typeof(inputState) == "EnumItem")
            Tool:Input(inputState, inputObject) 
        end
    end)
end


function Tool:Input(inputState : EnumItem?, inputObject: EnumItem?)
    if #self.Actions > 0 then return end -- queued actions need to finish!
    local Action = self.ActionPack.Input(self, inputState, inputObject)

    if Action then
        if self.Siblings then
            for _,tool in pairs(self.Siblings) do
                if tool:ShouldBlock(Action) then return end -- sibling does not want this action made!
            end
        end
        self:AddAction(Action)
        Action:Start(self)
    end
end

function Tool:QueueAction(Action, ActionCaller)
    if ActionCaller.State == "Finished" then
        Action:Start(self)
    else
        self.PlayerJanitor:Add(ActionCaller.Finished:Connect(function()
            Action:Start(self)
        end))
    end
    self:AddAction(Action)
end

function Tool:AddAction(Action)
    Action:SetPrimaryTool(self)
    table.insert(self.Actions, Action)
    
    local FinishedConnection
    FinishedConnection = Action.Finished:Connect(function()
        table.remove(self.Actions,table.find(self.Actions, Action))
        FinishedConnection:Disconnect()
    end)
    self.PlayerJanitor:Add(FinishedConnection)
end

function Tool:ChangeState(state)
    self.State = state
    self.StateChanged:Fire()
end


function Tool:Destroy()
    self._janitor:Destroy()
end


Tool.handleInput()

return Tool