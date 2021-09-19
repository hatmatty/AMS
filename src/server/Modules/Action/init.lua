local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Signal = require(Knit.Util.Signal)


local Action = {}
Action.__index = Action


function Action.new(name, start, stop, destroy)
    local self = setmetatable({}, Action)
    self._janitor = Janitor.new()

    self.Started = Signal.new()
    self.Stopped = Signal.new()
    self.Destroyed = Signal.new()

    self._janitor:Add(self.Started)
    self._janitor:Add(self.Stopped)
    self._janitor:Add(self.Destroyed)
    
    self.Name = name
    self._startFunc = start
    self._stopFunc = stop
    self._destroyFunc = destroy

    return self
end

function Action:Clone()
    local Action = Action.new(self.Name, self._startFunc, self._stopFunc, self._destroyFunc)
    Action:SetPrimaryTool(self.PrimaryTool)
    return Action
end

function Action:SetPrimaryTool(tool: Tool)
    self.PrimaryTool = tool
end

function Action:Start(caller: Tool) -- caller : the object which calls :stop on this action can be tracked as it will pass itself as the first argument, usually a tool
    self.Status = "Started"
    self.Started:Fire()
    self._startFunc(self, caller)
end

function Action:Stop(caller: Tool) 
    self.Status = "Stopped"
    self.Stopped:Fire()
    self._stopFunc(self, caller)
end

function Action:Destroy(caller: Tool)
    self.Status = "Destroyed"
    self.Destroyed:Fire()
    self._destroyFunc(self, caller)
    self._janitor:Destroy()
end


return Action