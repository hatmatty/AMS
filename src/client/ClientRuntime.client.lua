local Knit = require(game:GetService("ReplicatedStorage").Knit)
local Promise = require(Knit.Util.Promise)
local Component = require(Knit.Util.Component)

function Knit.OnComponentsLoaded()
    if Knit.ComponentsLoaded then
        return Promise.resolve()
    end
    return Promise.new(function(resolve)
        local heartbeat
        heartbeat = game:GetService("RunService").Heartbeat:Connect(function()
            if Knit.ComponentsLoaded then
                heartbeat:Disconnect()
                resolve()
            end
        end)
    end)
end 

Knit.AddControllers(script.Parent:WaitForChild("Controllers"))

Knit.Start():Then(function()
    Component.Auto(script.Parent.Components)
    Knit.ComponentsLoaded = true
end):Catch(warn)
