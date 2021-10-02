-- ToolService
---- handles creation of and client side communication with the Tool component

--[[

    AddTool(character: Model, toolName: string)


--]]

local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Janitor = require(Knit.Util.Janitor)
local Promise = require(Knit.Util.Promise)
local RemoteSignal = require(Knit.Util.Remote.RemoteSignal)
local Tool = require(script.Parent.Parent.Components.Tool)
local Network = require(game:GetService("ReplicatedStorage").Network)


local CollectionService = game:GetService("CollectionService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ToolModels = ReplicatedStorage:WaitForChild("Tools")

local Players = game:GetService("Players")

local ToolService = Knit.CreateService {
    Name = "ToolService";
    Client = {
        ToolInput = RemoteSignal.new(),
        CameraDirection = RemoteSignal.new()};
}


function ToolService:KnitStart() 
    Knit.OnComponentsLoaded()
    self.Players = {}

    for _,player in pairs(Players:GetPlayers()) do self:ManagePlayer(player) end
    Players.PlayerAdded:Connect(function(player) 
        self.Players[player] = self:ManagePlayer(player) 
    end)

    Players.PlayerRemoving:Connect(function(player)
        if self.Players[player] then self.Players[player]:Destroy() self.Players[player] = nil end
    end)

end

---@diagnostic disable-next-line: undefined-type
function ToolService:ManagePlayer(player) : Janitor
    local playerJanitor = Janitor.new()
    local charJanitor = Janitor.new()
    playerJanitor:Add(charJanitor)

    local function InitiateTool(item)
        if item:IsA("Model") then
            if ToolModels:FindFirstChild(item.Name) then
                local model = ToolService:AddTool(player.Character, item.Name)
                charJanitor:Add(item.AncestryChanged:Connect(function()
                    if not item:IsDescendantOf(game) then
                        model:Destroy()
                    end
                end))
            else
                warn("if you are intentionally adding models in starterpack that don't correspond to tools then delete this")
            end
        end
    end

    local function InitiateCharacter(character)
        for _,item in pairs(player.Backpack:GetChildren()) do
            InitiateTool(item)
        end
        charJanitor:Add(player.Backpack.ChildAdded:Connect(InitiateTool))
    end

    if player.Character then InitiateCharacter(player.Character) end
    playerJanitor:Add(player.CharacterAppearanceLoaded:Connect(InitiateCharacter))

    return playerJanitor
end


function ToolService:AddTool(character: Model, toolName: string) : Model
    local model = ToolModels:FindFirstChild(toolName):Clone()
    model.Parent = character
    CollectionService:AddTag(model, "Tool")
    return model
end

function ToolService:KnitInit()
    --nothing
end


return ToolService