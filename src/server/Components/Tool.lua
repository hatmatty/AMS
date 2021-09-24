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
	self.DefaultHandler = self.ActionHandler
	
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

    self.StateChanged = Signal.new(self.PlayerJanitor)
	self.HandlerChanged = Signal.new(self.PlayerJanitor)

    self.Player = player
    self.Character = self.Instance.Parent

    self:ManageSiblings()
    self:ManageInputs()

    self.Actions = {}
    self:Input(Enum.UserInputState.None,Enum.UserInputState.None)
end

function Tool:ManageInputs()
    self.Inputs = {}
    self.PlayerJanitor:Add(self.StateChanged:Connect(function()
        Tool:UpdateInputs()
    end))
end

function Tool:UpdateInputs()
	local updatedInputs = self.ActionHandler:GetAvaliableInputs(self.State)
	self.SendInput:Fire(self.Player, self.Id, "Destroy", self.Inputs)
	self.Inputs = updatedInputs
	self.SendInput:Fire(self.Player, self.Id, "Create", self.Inputs)
end

function Tool:Lock(signal, actionHandler)
	if self.Locked then error("cannot lock when already locked") end
	self.Locked = true
	self.ActionHandler = actionHandler
	
	signal:Connect(function() 
		self.Locked = nil
		self.ActionHandler = self.DefaultHandler	
	end) 
	
	self:UpdateInputs()
end

function Tool:ManageSiblings()
    self.Siblings = {}
	
	local function TryAddSibling(child)
		if Tools[child] then
			self.Siblings[child] = Tools[child]
			ManageHandler(sibling)
		end
	end
	
	local function TryRemoveSibling(child)
		if not self.Siblings[child] return 
		self.Siblings[child].HandlerChanged
		self.Siblings[child] = nil
	end
	
	self.PlayerJanitor:Add(self.Character.ChildAdded:Connect(TryAddSibling)

	self.PlayerJanitor:Add(self.Character.ChildRemoved:Connect(TryRemoveSibling)
	
	for _,child in pairs(self.Character) do TryAddSibling(child) end
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

function Tool:ChangeHandler(handler)
	self.ActionHandler = handler
	self.HandlerChanged:Fire()
end

function Tool:Input(inputState : EnumItem?, inputObject: EnumItem?)
    local Action = self.ActionHandler:GetAction(self.State, inputState, inputObject)
    if Action then self:AddAction(Action) end
end


function Tool:AddAction(Action)
    Action:SetPrimaryTool(self)
    self.Actions[Action.Name] = Action
    self.PlayerJanitor:Add(Action.Ended:Connect(function()
        self.Actions[Action.Name] = nil
    end))
    Action:Start()
end

function Tool:Queue(Action, ActionCaller)
	self.PlayerJanitor:Add(ActionCaller.Ended:Connect(function()
		self:AddAction(Action)	
	end))
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
