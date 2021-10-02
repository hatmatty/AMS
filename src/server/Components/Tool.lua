local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Network = require(game:GetService("ReplicatedStorage").Network)
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

Tool.CameraDirection = Signal.new()
Tool.CameraDirections = {}

Network:BindEvents({
    CameraDirection = function(player: Player, direction: string)
        assert(typeof(direction) == "string" and (direction == "Up" or direction == "Down"))
        Tool.CameraDirections[player] = direction
    end
})

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
    self.Buttons = {}

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
    self.Mode = "Player"

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
    self.InputEnabled = true
    if not Tools[self.Player] then
        Tools[self.Player] = {}
    end
    table.insert(Tools[self.Player], self)
end


function Tool:Lock(signal, actionHandler)
	if self.Locked then error("cannot lock when already locked") end
	self.Locked = true
	self.ActionHandler = actionHandler
	
	signal:Connect(function() 
		self.Locked = nil
        self:ChangeHandler(self.DefaultHandler)
	end)
	
end

function Tool:Damage(humanoid,damage)
    humanoid:TakeDamage(damage)
    local damagedPlayer = Players:GetPlayerFromCharacter(humanoid.Parent)
    if damagedPlayer then Network:FireClient(damagedPlayer, "Damaged") end
    Network:FireClient(self.Player, "Hit")
end

function Tool:ManageSiblings()
    self.Siblings = {}
	
	local function TryAddSibling(child)
		if Tools[child] then
			self.Siblings[child] = Tools[child]
		end
	end

    self.PlayerJanitor:Add(self.Character.ChildAdded:Connect(TryAddSibling))
	self.PlayerJanitor:Add(self.Character.ChildRemoved:Connect(function(child)
        if not self.Siblings[child] then return end  
		self.Siblings[child] = nil
    end))
	
	for _,child in pairs(self.Character:GetChildren()) do TryAddSibling(child) end
end

function Tool:CharacterDestroy()
    table.remove(Tools[self.Player], table.find(Tools[self.Player], self))
    self.Mode = nil
    self.PlayerJanitor:Destroy()
end

function Tool.handleInput() -- DNT (do not trust) : recieved by client
    Network:BindEvents({
        Input = function(player, inputState, inputObject)
            if Tools[player] then
                assert(typeof(inputObject) == "EnumItem" and typeof(inputState) == "EnumItem")
                for _, tool in pairs(Tools[player]) do
                    tool:Input(inputState,inputObject)
                end
            end
        end
    })
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
    if self.Mode == "Player" then
        self:CharacterDestroy()
    end
    Tools[self.Instance] = nil
    Tools[self.Id] = nil
    self._janitor:Destroy()
end


Tool.handleInput()

return Tool
