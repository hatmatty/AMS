local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Players = game:GetService("Players")
local Network = require(game:GetService("ReplicatedStorage").Network)
local Config = require(game:GetService("ReplicatedStorage").Config)
local TweenService = game:GetService("TweenService")
local TweenInfo = TweenInfo.new(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.In) --sine is ma fav!


local SprintingService = Knit.CreateService {
    Name = "SprintingService";
    Client = {};
}


function SprintingService:KnitStart()
    if not Config.Sprinting then return end
    Network:BindEvents({
        Input2 = function(player, inputState, inputObject)
            if inputObject == Enum.KeyCode.LeftControl and inputState == Enum.UserInputState.Begin then
                if player.Character then
                    self:ToggleSprint(player.Character)
                end
            end
        end
    })

    Players.PlayerRemoving:Connect(function(player)
        if player.Character then
            self.Status[player.Character] = nil
            self.Tweens[player.Character] = nil
        end
    end)
end

function SprintingService:ToggleSprint(character)
    if self.Status[character] == nil then self:SetupSprinting(character) end

    if self.Status[character] then
        self:DisableSprinting(character)
    else
        self:EnableSprinting(character)
    end
end

function SprintingService:SetupSprinting(character)
    character:WaitForChild("Humanoid").Died:Connect(function()
        self:DisableSprinting(character)
        self.Status[character] = nil
        self.Tweens[character] = nil
    end)

    self.Status[character] = false
end

function SprintingService:EnableSprinting(character)
    self.Status[character] = true
    if self.Tweens[character] then self.Tweens[character]:Pause() end
    self.Tweens[character] = TweenService:Create(character:WaitForChild("Humanoid"), TweenInfo, {WalkSpeed = Config.SprintingSpeed}):Play()


end

function SprintingService:DisableSprinting(character)
    self.Status[character] = false
    if self.Tweens[character] then self.Tweens[character]:Pause() end
    self.Tweens[character] = TweenService:Create(character:WaitForChild("Humanoid"), TweenInfo, {WalkSpeed = Config.WalkingSpeed}):Play()
end


function SprintingService:KnitInit()
    self.Status = {}
    self.Tweens = {}
end


return SprintingService