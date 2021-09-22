local Knit = require(game:GetService("ReplicatedStorage").Knit)
local HttpService = game:GetService("HttpService")
local Config = require(game:GetService("ReplicatedStorage").Config)
local Janitor = require(Knit.Util.Janitor)
local Component = require(Knit.Util.Component)
local Signal = require(Knit.Util.Signal)
local RemoteSignal = require(Knit.Util.Remote.RemoteSignal)

local Players = game:GetService("Players")

local ActionHandlers = script.Parent.Parent.Modules.Action.ActionHandler

local Tools = {}

local Tool = {}
Tool.__index = Tool
Tool.Tag = "Tool"
Tool.SendInput = Signal.new()
Tool.GetInput = Signal.new()


function Tool.new(instance)

    local self = setmetatable({}, Tool)

    self._janitor = Janitor.new()
    self._janitor:Add(instance)

    self.Config = Config.Tools[instance.Name]
	if not self.Config then error("tool " .. instance.Name .. " need to be configured") end

    self.Name = self.Config.Name
    self.ActionHandler = require(ActionHandlers:FindFirstChild(self.Config.ActionHandler))

    -- then find the appropriate module which contains the actions for the tool

    self.Id = HttpService:GenerateGUID()
    Tools[instance] = self
    Tools[self.Id] = self

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
        local updatedInputs = self.ActionHandler:GetAvaliableInputs(self.State)
        self.SendInput:Fire(self.Player, self.Id, "Destroy", self.Inputs)
        self.Inputs = updatedInputs
        self.SendInput:Fire(self.Player, self.Id, "Create", self.Inputs)
    end)
end

function Tool:ManageSiblings()
    -- WIP!!
    self.Siblings = {}
	
	self.PlayerJanitor:Add(self.Character.ChildAdded:Connect(function(child) 
		if Tools[child] then
			self.Siblings[child] = Tool
		end
	end))
	
	self.PlayerJanitor:Add(self.Character.ChildRemoved:Connect(function(child)
		if self.Siblings[child] then self.Siblings[child] = nil end
	end))
end

function Tool:CharacterDestroy()
    self.PlayerJanitor:Destroy()
end

function Tool.handleInput() -- DNT (do not trust) : recieved by client
    Tool.GetInput:Connect(function(player: Player, toolId: string, inputState: Enum, inputObject: Enum )
        assert(typeof(toolId) == "string")
        local Tool = Tools[toolId]
        if Tool and Tool.Player == player then
            assert(typeof(inputObject) == "EnumItem" and typeof(inputState) == "EnumItem")
            Tool:Input(inputState, inputObject) 
        end
    end)
end


function Tool:Input(inputState : EnumItem?, inputObject: EnumItem?)
    if #self.Actions > 0 then return end -- queued actions need to finish!
    local Action = self.ActionHandler:GetAction(self.State, inputState, inputObject)
	for _,siblingTool in pairs(self.Siblings) do
		local siblingAction = siblingTool.ActionHandler:GetAction(self.State, inputState, inputObject) end
		if siblingAction.Priority > Action.Priority then return end -- sibling wants their action to go!
	end
    if Action then
        self:AddAction(Action)
    end
end

function Tool:AddAction(Action)
    Action:SetPrimaryTool(self)
    if self.Action then
        table.insert(self.Actions, Action)
    else
        self:StartAction(Action)
    end
end

function Tool:StartAction(Action)
    self.Action = Action
    local EndedConnection
    EndedConnection = Action.Ended:Connect(function()
        EndedConnection:Disconnect()

        self.Action = nil
        if #self.Actions > 0 then
            local NewAction = self.Actions[1]
            table.remove(self.Actions,1)
            self:StartAction(NewAction)
        end
    end)
    self.PlayerJanitor:Add(EndedConnection)

    Action:Start()
end

function Tool:ChangeState(state)
    self.State = state
    self.StateChanged:Fire()
end


function Tool:Destroy()
    Tools[self.Instance] = nil
    Tools[self.Id] = nil
    self._janitor:Destroy()
end


Tool.handleInput()

return Tool
