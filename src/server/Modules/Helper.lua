local Helper = {}

function Helper.playAnim(character, animation, animInfo)
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

function Helper.CombineTables(...)
	local tables = {...}
	local totalContentCount = 0

	for _,t in pairs(tables) do
		totalContentCount += #t
	end
	local combined = table.create(totalContentCount)

	for _,t in pairs(tables) do
		table.move(t, 1, #t, #combined, combined)
	end

	return combined
end

return Helper