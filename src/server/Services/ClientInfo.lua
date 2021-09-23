-- used to access information from clients

local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Players = game:GetService("Players")
local RemoteSignal = require(Knit.Util.Remote.RemoteSignal)

local ClientInfo = Knit.CreateService {
    Name = "ClientInfo";
    Client = {
        CameraDirection = RemoteSignal.new()
    };
}

ClientInfo.Info = {}


function ClientInfo:KnitStart() end

function getFunc(inputType)
    return function(player: Player, ...)
        if not ClientInfo.Info[player] then ClientInfo.Info[player] = {} end
        ClientInfo.Info[player][inputType] = ...
    end
end

function ClientInfo:KnitInit()
    Players.PlayerRemoving:Connect(function(player) self.Info[player] = nil end)
    self.Client.CameraDirection:Connect(getFunc("CameraDirection"))
end


return ClientInfo