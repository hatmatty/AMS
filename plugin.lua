local Version = "0.3.0"

local PluginFolder = script.Parent
if not PluginFolder:IsA("Folder") then
    error("Plugin folder is not a folder.")
end
local Assets = PluginFolder.Assets
local rbxts_include = PluginFolder["rbxts_include"]
local shared = PluginFolder.shared
local server = PluginFolder.server
local client = PluginFolder.client
local Animations = PluginFolder.Animations
local Animate = PluginFolder.Animate
local PlayerModule = PluginFolder.PlayerModule
Animate.Disabled = true

function ToggleScripts(instance: Instance, bool: boolean)
    for _,v in pairs(instance:GetDescendants()) do
        if v:IsA("Script") or v:IsA("LocalScript") then
            v.Disabled = bool
        end
    end
end

ToggleScripts(rbxts_include, true)
ToggleScripts(server, true)
ToggleScripts(client, true)
ToggleScripts(shared, true)

local Config = shared.Config:Clone()
shared.Config:Destroy()

local toolbar = plugin:CreateToolbar("AET")

local Setup = toolbar:CreateButton("Setup", "Sets up and updates AET.", "")
local InitalizeTool = toolbar:CreateButton("Initalize Tool", "Initializes a tool.", "")

Setup.ClickableWhenViewportHidden = true
InitalizeTool.ClickableWhenViewportHidden = true

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Teams = game:GetService("Teams")
local ServerScriptService = game:GetService("ServerScriptService")
local StarterPlayer = game:GetService("StarterPlayer")
local StarterCharacterScripts = StarterPlayer.StarterCharacterScripts
local StarterPlayerScripts = StarterPlayer.StarterPlayerScripts
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local Selection = game:GetService("Selection")

function DoUpdateScripts()
    local GameInclude = ReplicatedStorage:FindFirstChild("rbxts_include")
    local GameShared = ReplicatedStorage:FindFirstChild("shared")
    local GameClient = ServerScriptService:FindFirstChild("server")
    local GameServer = StarterPlayerScripts:FindFirstChild("client")
    local GameChar = StarterCharacterScripts:FindFirstChild("char")
    local newConfig: ModuleScript = GameShared and GameShared.Config:Clone() or Config:Clone()
    newConfig:SetAttribute("Version", Version)
    local oldConfig = GameShared and GameShared:FindFirstChild("Config_OLD") and GameShared:FindFirstChild("Config_OLD"):Clone()

    if GameInclude then
        GameInclude:Destroy()
    end

    if GameShared then
        GameShared:Destroy()
    end

    if GameClient then
        GameClient:Destroy()
    end

    if GameServer then
        GameServer:Destroy()
    end

    if GameChar then
        GameChar:Destroy()
    end
    
    local newServer = server:Clone()
    newServer.Parent = ServerScriptService

    local newClient = client:Clone()
    newClient.Parent = StarterPlayerScripts

    local newInclude = rbxts_include:Clone()
    newInclude.Parent = ReplicatedStorage

    local newAnimate = Animate:Clone()
    local newPlayerModule = PlayerModule:Clone()

    if StarterCharacterScripts:FindFirstChild("Animate") then
        StarterCharacterScripts.Animate:Destroy()
    end

    if StarterPlayerScripts:FindFirstChild("PlayerModule") then
        StarterPlayerScripts.PlayerModule:Destroy()
    end

    newAnimate.Parent = StarterCharacterScripts
    newPlayerModule.Parent = StarterPlayerScripts
    newAnimate.Disabled = false 

    local newShared = shared:Clone()
    newShared.Parent = ReplicatedStorage

    newConfig.Parent = newShared

    ToggleScripts(newInclude, false)
    ToggleScripts(newServer, false)
    ToggleScripts(newClient, false)
    ToggleScripts(newShared, false)

    if game.Workspace:FindFirstChild("Animations") then
        game.Workspace.Animations:Destroy()
    end
    local newAnimations = Animations:Clone()
    newAnimations.Parent = game.Workspace


    if oldConfig then
        oldConfig.Parent = newShared
        warn("You have a config that may need to be updated! If you press setup again your old config will be deleted. OLD:", oldConfig, "- NEW:", newConfig)
        if oldConfig:GetAttribute("Version") and oldConfig:GetAttribute("Version") == Version then
            warn("You are updating to the same version.")
        end
    else
        warn("Make sure you export and set new animations. Config:", newConfig, "- Animations:", newAnimations)
    end

    if not game.Workspace:GetAttribute("AET_INITED") then
        game.Workspace:SetAttribute("AET_INITED", true)
        local newTeam = Instance.new("Team")
        newTeam.Name = "Neutral"
        newTeam.TeamColor = BrickColor.new("Institutional white")
        newTeam.AutoAssignable = true
        newTeam.Parent = Teams

        local function CreateTeamTool(toolName)
            local newModel = Instance.new("Model")
            newModel.Name = toolName
            newModel.Parent = newTeam
        end

        CreateTeamTool("Athens")
        CreateTeamTool("Bow")
        CreateTeamTool("Dory")
        CreateTeamTool("Kopis")
        CreateTeamTool("Roman")
        CreateTeamTool("Shield")
        CreateTeamTool("Sparta")
    end
end

function DoUpdateAssets()
    local GameAssets = ReplicatedStorage:FindFirstChild("Assets")
    if not GameAssets then
        local newAssets = Assets:Clone()
        newAssets.Parent = ReplicatedStorage
    else
        for _,v in pairs(Assets:GetChildren()) do
            if GameAssets:FindFirstChild(v.Name) then
                if v.Name == "Tools" then
                    for _,v2 in pairs(Assets.Tools:GetChildren()) do
                        if GameAssets.Tools:FindFirstChild(v2.Name) then
                            GameAssets.Tools[v2.Name]:Destroy()
                        end
                        local newTool = v2:Clone()
                        newTool.Parent = GameAssets.Tools
                    end
                    continue
                else
                    GameAssets[v.Name]:Destroy()
                end 
            end

            local newV = v:Clone()
            newV.Parent = GameAssets
        end
    end
end

function DoAddConfig()
    local GameShared = ReplicatedStorage:FindFirstChild("shared")
    if not GameShared then
        GameShared = Instance.new("Folder")
        GameShared.Name = "shared"
        GameShared.Parent = ReplicatedStorage
    end
    local OldConfig = GameShared:FindFirstChild("Config")
    if OldConfig then
        OldConfig.Name = "Config_OLD"
    end
    local newConfig = Config:Clone()
    newConfig.Parent = GameShared
    newConfig:SetAttribute("Version", Version)
end

function DoInitalizeTool()
    local CurrentSelection = Selection:Get()
    if #CurrentSelection ~= 1 then
        return warn("Select only the main model of the tool.")
    end
    local Tool = CurrentSelection[1]
    if not Tool:IsA("Model") then
        return warn("Tool selected is not a model")
    end

    local Attach: Instance
    for _,v in pairs(Tool:GetChildren()) do
        if string.find(v.Name, "Attach") then
            Attach = v
            break
        end
    end

    if not Attach then
        return warn("Tool selected does not have an attach.")
    end

    local parts = {}
    for _,v in ipairs(Tool:GetDescendants()) do
        if v == Attach then
            continue
        elseif v:IsA("BasePart") then
            parts[#parts + 1] = v
        elseif v:IsA("Weld") then
            warn("existing weld",v,"may cause problems with the new welds being added")
        end
    end

	if #parts>0 then
		local d = {}
		for i=1,#parts do
			local p1,p0 = Attach,parts[i]
			p1.Anchored,p0.Anchored = true,true
			local joint = Instance.new("Weld")
			joint.Part0 = p1
			joint.Part1 = p0
			joint.C0 = p1.CFrame:toObjectSpace(p0.CFrame)
			joint.C1 = CFrame.new()
			joint.Parent = p1
			joint.Name = p0.Name
			p1.Anchored,p0.Anchored = false,false
            p0.CanCollide = false
            p0.Massless = true
			d[#d+1]=joint
		end
		Selection:Set(d)
	else
		return warn("The tool you are attempting to select does not have any baseparts to be welded.")
	end
end

Setup.Click:Connect(function()
    plugin:SelectRibbonTool(Enum.RibbonTool.Select,UDim2.new(0,0,0,0))
    DoAddConfig()
    DoUpdateAssets()
    DoUpdateScripts()
    print("Succesfully Setup AET")
    ChangeHistoryService:SetWaypoint("Setup")
end)

InitalizeTool.Click:Connect(function()
    plugin:SelectRibbonTool(Enum.RibbonTool.Select,UDim2.new(0,0,0,0))
    DoInitalizeTool()
    print("Succesfully Initialized Tool")
    ChangeHistoryService:SetWaypoint("InitalizedTool")
end)