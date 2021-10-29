import { Players } from "@rbxts/services"
import { Service, OnStart, OnInit } from "@flamework/core";
import { Config } from "shared/Config"


@Service()
export class Ragdoll implements OnInit {
    OnInit() {
        if (!Config.Ragdoll) {
            return
        }
        
        Players.PlayerAdded:Connect(function(Player)
        Player.CharacterAdded:Connect(function(Char)
                Char:WaitForChild("Humanoid").BreakJointsOnDeath = false
                Char.Humanoid.Died:Connect(function()
                        local m = Instance.new("Model")
                        m.Parent = game.Workspace
                        --game:GetService("Debris"):AddItem(m,60)
                        local g = Char:GetChildren()
                        Char.HumanoidRootPart.CanCollide = false
                        for i = 1,#g do
                                g[i].Parent = m
                        end
                        for _, v in pairs(m:GetDescendants()) do
                                if v:IsA("BasePart") then
                                        v:SetNetworkOwner(Player)
                                end
                                if v:IsA("Motor6D") then
                                        local Att0, Att1 = Instance.new("Attachment"), Instance.new("Attachment")
                                        Att0.CFrame = v.C0
                                        Att1.CFrame = v.C1
                                        Att0.Parent = v.Part0
                                        Att1.Parent = v.Part1
                                        local BSC = Instance.new("BallSocketConstraint")
                                        BSC.Attachment0 = Att0
                                        BSC.Attachment1 = Att1
                                        BSC.Parent = v.Part0
                                        if v.Part1.Name ==  "Head" then
                                                BSC.LimitsEnabled = true
                                                BSC.TwistLimitsEnabled = true
                                        end
                                        v.Enabled = false
                                end
                                if v.Name == "AccessoryWeld" then
                                        local WC = Instance.new("WeldConstraint")
                                        WC.Part0 = v.Part0
                                        WC.Part1 = v.Part1
                                        WC.Parent = v.Parent
                                        v.Enabled = false
                                end
                                if v.Name == "Head" then
                                        v.CanCollide = true
                                end
                        end
                end)
        end)
end)
    }
}

