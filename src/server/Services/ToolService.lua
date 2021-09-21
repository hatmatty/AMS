-- ToolService
---- handles creation of and client side communication with the Tool component

--[[

    AddTool(character: Model, toolName: string)


--]]

local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Promise = require(Knit.Util.Promise)
local RemoteSignal = require(Knit.Util.Remote.RemoteSignal)
local Tool = require(script.Parent.Parent.Components.Tool)

local CollectionService = game:GetService("CollectionService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ToolModels = ReplicatedStorage:WaitForChild("Tools")

local Players = game:GetService("Players")

local ToolService = Knit.CreateService {
    Name = "ToolService";
    Client = {ToolInput = RemoteSignal.new()};
}


function ToolService:KnitStart() 
    Knit.OnComponentsLoaded()

    --[[
    Since remote signals can only be created in services inside of client tables, the Tool component
    has a signal which is redirected to a remote event which the Tool Service houses and that remote
    event is redirected to the signal
    --]]

    local GetInput = Tool.GetInput
    local SendInput = Tool.SendInput
    local ToolInputRemote = self.Client.ToolInput
    SendInput:Connect(function(player, ...)
        ToolInputRemote:Fire(player, ...)
    end)
    ToolInputRemote:Connect(function(...)
        GetInput:Fire(...)
    end)

    for _,player in pairs(Players:GetPlayers()) do self:ManagePlayer(player) end
    Players.PlayerAdded:Connect(function(...) self:ManagePlayer(...) end)

end


function ToolService:ManagePlayer(player)
    if player.Character then self:AddTool(player.Character) end
    player.CharacterAppearanceLoaded:Connect(function(character) self:AddTool(character, "Test") end)
end


function ToolService:AddTool(character: Model, toolName: string)
    local model = ToolModels:FindFirstChild(toolName):Clone()
    model.Parent = character
    CollectionService:AddTag(model, "Tool")
end

function ToolService:KnitInit()
    --nothing
end


return ToolService