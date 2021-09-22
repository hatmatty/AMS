local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Signal = require(Knit.Util.Signal)


local Action = {}
Action.__index = Action


function Action.new(name, Start, End, priority)
    local self = setmetatable({}, Action)
    self._janitor = Janitor.new()

    self.Started = Signal.new()
    self.Ended = Signal.new()

    self._janitor:Add(self.Started)
    self._janitor:Add(self.Ended)
    
    self.Name = name
    -- functions
    self._Start = Start
    self._End = End

	self.Priority = Priority or 0


    self.State = "Created"

    return self
end

function Action:Clone()
    local ClonedAction = Action.new(self.Name, self._Start, self._Cancel, self._End)
    ClonedAction:SetPrimaryTool(self.PrimaryTool)
    return ClonedAction
end

function Action:SetPrimaryTool(tool: Tool)
    self.PrimaryTool = tool
end

function Action:Start() -- caller : the object which calls :stop on this action can be tracked as it will pass itself as the first argument, usually a tool
    self.State = "Started"
    self:_Start()
    self.Started:Fire()
end

function Action:End()
    self.State = "Ended"
    if self._End then self:_End() end
    self.Ended:Fire()
    self._janitor:Destroy()
end

-- all actions share this because almost all actions play an animation
function Action._playAnim(character, animation, animInfo)
    if typeof(animation) == "number" then
        animation = tostring(animation)
    end
    if typeof(animation) == "string" then
        if string.sub(animation,1,13) ~= "rbxassetid://" then
            animation = "rbxassetid://" .. animation
        end
        local newAnimation = Instance.new("Animation")
        newAnimation.AnimationId = animation
        animation = newAnimation
    end
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		-- need to use animation object for server access
		local animator = humanoid:FindFirstChildOfClass("Animator")
		if animator then
			local animationTrack = animator:LoadAnimation(animation)
            animationTrack.Looped = animInfo["Looped"]
			animationTrack:Play()
			return animationTrack
		end
	end
end


return Action
