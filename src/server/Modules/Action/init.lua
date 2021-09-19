local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Signal = require(Knit.Util.Signal)


local Action = {}
Action.__index = Action


function Action.new(name, start, cancel, finish)
    local self = setmetatable({}, Action)
    self._janitor = Janitor.new()

    self.Started = Signal.new()
    self.Cancelled = Signal.new()
    self.Finished = Signal.new()

    self._janitor:Add(self.Started)
    self._janitor:Add(self.Cancelled)
    self._janitor:Add(self.Finished)
    
    self.Name = name
    -- functions
    self._Start = start
    self._Cancel = cancel
    self._Finish = finish

    self.State = "Created"

    return self
end

function Action:Clone()
    local ClonedAction = Action.new(self.Name, self._Start, self._Cancel, self._Finish)
    ClonedAction:SetPrimaryTool(self.PrimaryTool)
    return ClonedAction
end

function Action:SetPrimaryTool(tool: Tool)
    self.PrimaryTool = tool
end

function Action:Start(caller: Tool) -- caller : the object which calls :stop on this action can be tracked as it will pass itself as the first argument, usually a tool
    self.State = "Started"
    self._Start(self, caller)
    self.Started:Fire()
end

function Action:Cancel(caller: Tool) 
    self.State = "Cancelled"
    if self._Cancel then self._Cancel(self, caller) end
    self.Cancelled:Fire()
end

function Action:Finish(caller: Tool)
    self.State = "Finished"
    if self._Finish then self._Finish(self, caller) end
    self.Finished:Fire()
    self._janitor:Destroy()
    print("Fired")
end


return Action