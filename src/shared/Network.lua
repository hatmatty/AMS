--[[
	READ ME
	

	-- Server API
	
	Network:BindFunctions(functions) 
	Network:BindEvents(events)
	
	Network:FireClient(client, name, ...)
	Network:FireAllClients(name, ...)
	Network:FireOtherClients(ignoreclient, name, ...)
	Network:FireOtherClientsWithinDistance(ignoreclient, distance, name, ...)
	Network:FireAllClientsWithinDistance(position, distance, name, ...)
	
	Network:InvokeClient(client, name, ...)  (same as below with timeout = 60)
	Network:InvokeClientWithTimeout(timeout, client, name, ...)
	
	Network:LogTraffic(duration)
	
	-- Internal overrideable methods, used for custom AllClients/OtherClients/WithinDistance selectors
	
	Network:GetPlayers()
	Network:GetPlayerPosition(player)
	
	-- Client API
	
	Network:BindFunctions(functions) 
	Network:BindEvents(events) 
	
	Network:FireServer(name, ...)
	
	Network:InvokeServer(name, ...) 
	Network:InvokeServerWithTimeout(timeout, name, ...)
	
	
	
	Notes:
	- The first return value of InvokeClient (but not InvokeServer) is bool success, which is false if the invocation timed out
	  or the handler errored.
	
	- InvokeServer will error if it times out or the handler errors

	- InvokeServer/InvokeClient do not return instantly on an error, but instead check for failure every 0.5 seconds. This is
	  because it is not possible to both instantly detect errors and have them be logged in the output with full stacktraces.
	
	
	
	For detailed API Use/Documentation, see
	https://devforum.roblox.com/t/easynetwork-creates-remotes-events-for-you-so-you-dont-have-to/
--]]


local Network = {}

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")

local EventHandlers = {}
local FunctionHandlers = {}

local IsStudio = RunService:IsStudio()
local IsServer = RunService:IsServer()

local LoggingNetwork
local function GetParamString(...)
	local tab = table.pack(...)
	local n = math.min(10, tab.n)
	
	for index = 1, n do 
		local value = tab[index]
		local valueType = typeof(tab[index])
		
		if valueType == "string" then
			tab[index] = string.format("%q[%d]", #value <= 18 and value or value:sub(1, 15) .. "...", #value)
		elseif valueType == "Instance" then
			local success, className = pcall(function() return value.ClassName end)
			tab[index] = success and string.format("%s<%s>", valueType, className) or valueType
		else
			tab[index] = valueType
		end
	end
	
	return table.concat(tab, ", ", 1, n) .. (tab.n > n and string.format(", ... (%d more)", tab.n - n) or "")
end

local DeferredHandlers = {}

local ReceiveCounter = 0
local InvokeCounter = 0

local Communication,FunctionsFolder,EventsFolder

if IsServer then
	Communication = Instance.new("Folder",ReplicatedStorage)
	Communication.Name = "Communication"
	FunctionsFolder = Instance.new("Folder",Communication)
	FunctionsFolder.Name = "Functions"
	EventsFolder = Instance.new("Folder",Communication)
	EventsFolder.Name = "Events"
else
	Communication = ReplicatedStorage:WaitForChild("Communication")
	FunctionsFolder = Communication:WaitForChild("Functions")
	EventsFolder = Communication:WaitForChild("Events")
end
-- Thread utilities

local SpawnBindable = Instance.new("BindableEvent")

function FastSpawn(fn, ...)
	coroutine.wrap(function(...)
		SpawnBindable.Event:Wait()
		fn(...)
	end)(...)
	
	SpawnBindable:Fire()
end

function YieldThread()
	-- needed a way to first call coroutine.yield(), and then call SpawnBindable.Event:Wait()
	-- but return what coroutine.yield() returned. This is kinda ugly, but the only other
	-- option was to create a temporary table to store the results, which I didn't want to do
	
	return (function(...) SpawnBindable.Event:Wait() return ... end)(coroutine.yield())
end

function ResumeThread(thread, ...)
	coroutine.resume(thread, ...)
	SpawnBindable:Fire()
end

--

-- Calls fn(...) in a separate thread and returns false if it errors or invoking client leaves the game.
-- Fail state is only checked every 0.5 seconds, so don't expect errors to return immediately
function SafeInvokeCallback(handler, ...)
	local finished = false
	local callbackThread
	local invokeThread
	local result
	
	local function finish(...)
		if not finished then
			finished = true
			result = table.pack(...)
			
			if invokeThread then
				ResumeThread(invokeThread)
			end
		end
	end
	
	FastSpawn(function(...)
		callbackThread = coroutine.running()
		finish(true, handler.Callback(...))
	end, ...)
	
	if not finished then
		local client = IsServer and (...)
		
		coroutine.wrap(function()
			while not finished and coroutine.status(callbackThread) ~= "dead" do
				if IsServer and client.Parent ~= Players then
					break
				end
				
				wait(0.5)
			end
			
			finish(false)
		end)()
	end
	
	if not finished then
		invokeThread = coroutine.running()
		YieldThread()
	end
	
	return unpack(result)
end

function SafeInvoke(timeout, handler, ...)
	local thread = coroutine.running()
	local finished = false
	local result

	coroutine.wrap(function(...)
		if IsServer then
			result = table.pack(pcall(function(...) return handler.Remote:InvokeClient(...) end, ...))
		else
			result = table.pack(pcall(function(...) return handler.Remote:InvokeServer(...) end, ...))
		end

		if not finished then
			finished = true
			ResumeThread(thread)
		end
	end)(...)
	
	if typeof(timeout) == "number" then
		delay(timeout, function()
			if not finished then
				finished = true
				ResumeThread(thread)
			end
		end)
	end

	YieldThread()

	if result and result[1] == true and result[2] == true then
		return true, unpack(result, 3)
	end

	return false
end

function SafeFireEvent(handler, ...)
	local callbacks = handler.Callbacks
	local index = #callbacks
	
	while index > 0 do
		local running = true
		
		FastSpawn(function(...)
			while running and index > 0 do
				local fn = callbacks[index]
				index -= 1
				
				fn(...)
			end
		end, ...)
		
		running = false
	end
end

-- Regular :WaitForChild had issues with order (remoteevents were going through before waitforchild resumed)
function WaitForChild(parent, name)
	local remote = parent:FindFirstChild(name)

	if not remote then
		local thread = coroutine.running()
		local con

		con = parent.ChildAdded:Connect(function(child)
			if child.Name == name then
				con:Disconnect()
				remote = child
				ResumeThread(thread)
			end
		end)

		YieldThread()
	end

	return remote
end

function GetEventHandler(name)
	local handler = EventHandlers[name]
	if handler then
		return handler
	end
	
	local handler = {
		Name = name,
		Folder = EventsFolder,
		
		Callbacks = {},
		IncomingQueueErrored = nil
	}
	
	EventHandlers[name] = handler
	
	if IsServer then
		local remote = Instance.new("RemoteEvent")
		remote.Name = handler.Name
		remote.Parent = handler.Folder

		handler.Remote = remote
	else
		FastSpawn(function()
			handler.Queue = {}

			local remote = WaitForChild(handler.Folder, handler.Name)
			handler.Remote = remote
			
			if #handler.Callbacks == 0 then
				handler.IncomingQueue = {}
			end
				
			remote.OnClientEvent:Connect(function(...)
				if handler.IncomingQueue then
					if #handler.IncomingQueue >= 2048 then
						if not handler.IncomingQueueErrored then
							handler.IncomingQueueErrored = true
							FastSpawn(error, string.format("Exhausted remote invocation queue for %s", remote:GetFullName()), -1)
							
							delay(1, function()
								handler.IncomingQueueErrored = nil
							end)
						end
						
						if #handler.IncomingQueue >= 8172 then
							table.remove(handler.IncomingQueue, 1)
						end
					end
					
					ReceiveCounter += 1
					table.insert(handler.IncomingQueue, table.pack(ReceiveCounter, handler, ...))
					return
				end
				
				SafeFireEvent(handler, ...)
			end)
			
			if not IsStudio then
				remote.Name = ""
			end
			
			for _,fn in pairs(handler.Queue) do
				fn()
			end
			
			handler.Queue = nil
		end)
	end
	
	return handler
end

function GetFunctionHandler(name)
	local handler = FunctionHandlers[name]
	if handler then
		return handler
	end
	
	local handler = {
		Name = name,
		Folder = FunctionsFolder,
		
		Callback = nil,
		IncomingQueueErrored = nil
	}
	
	FunctionHandlers[name] = handler
	
	if IsServer then
		local remote = Instance.new("RemoteFunction")
		remote.Name = handler.Name
		remote.Parent = handler.Folder
		
		handler.Remote = remote
	else
		FastSpawn(function()
			handler.Queue = {}
			
			local remote = WaitForChild(handler.Folder, handler.Name)
			handler.Remote = remote
			
			handler.IncomingQueue = {}
			handler.OnClientInvoke = function(...)
				if not handler.Callback then
					if #handler.IncomingQueue >= 2048 then
						if not handler.IncomingQueueErrored then
							handler.IncomingQueueErrored = true
							FastSpawn(error, string.format("Exhausted remote invocation queue for %s", remote:GetFullName()), -1)
							
							delay(1, function()
								handler.IncomingQueueErrored = nil
							end)
						end
						
						if #handler.IncomingQueue >= 8172 then
							table.remove(handler.IncomingQueue, 1)
						end
					end
				
					ReceiveCounter += 1
					local params = table.pack(ReceiveCounter, handler, coroutine.running())
					
					table.insert(handler.IncomingQueue, params)
					YieldThread()
				end
				
				return SafeInvokeCallback(handler, ...)
			end
			
			if not IsStudio then
				remote.Name = ""
			end
			
			for _,fn in pairs(handler.Queue) do
				fn()
			end
			
			handler.Queue = nil
		end)
	end
	
	return handler
end

function AddToQueue(handler, fn, doWarn)
	if handler.Remote then
		return fn()
	end
	
	handler.Queue[#handler.Queue + 1] = fn
	
	if doWarn then
		delay(5, function()
			if not handler.Remote then
				warn(debug.traceback(("Infinite yield possible on '%s:WaitForChild(\"%s\")'"):format(handler.Folder:GetFullName(), handler.Name)))
			end
		end)
	end
end

function ExecuteDeferredHandlers()
	local handlers = DeferredHandlers
	local queue = {}
	
	DeferredHandlers = {}
	
	for handler in pairs(handlers) do
		local incoming = handler.IncomingQueue
		handler.IncomingQueue = nil

		table.move(incoming, 1, #incoming, #queue + 1, queue)
	end
	
	table.sort(queue, function(a, b) return a[1] < b[1] end)
	
	for _,v in ipairs(queue) do
		local handler = v[2]
		
		if handler.Callbacks then
			SafeFireEvent(handler, unpack(v, 3))
		else
			ResumeThread(v[3])
		end
	end
end

local Middleware = {
	MatchParams = function(name, paramTypes)
		paramTypes = { unpack(paramTypes) }
		local paramStart = 1
		
		for i,v in pairs(paramTypes) do
			local list = type(v) == "string" and string.split(v, "|") or v
			
			local dict = {}
			local typeListString = ""
			
			for _,v in pairs(list) do
				local typeString = v:gsub("^%s+", ""):gsub("%s+$", "")
				
				typeListString ..= (#typeListString > 0 and " or " or "") .. typeString
				dict[typeString:lower()] = true
			end
			
			dict._string = typeListString
			paramTypes[i] = dict
		end
		
		if IsServer then
			paramStart = 2
			table.insert(paramTypes, 1, false)
		end
		
		local function MatchParams(fn, ...)
			local params = table.pack(...)
			
			if params.n > #paramTypes then
				if IsStudio then
					warn(("[Network] Invalid number of parameters to %s (%s expected, got %s)"):format(name, #paramTypes - paramStart + 1, params.n - paramStart + 1))
				end
				return
			end
			
			for i = paramStart, #paramTypes do
				local argType = typeof(params[i])
				local argExpected = paramTypes[i]
				
				if not argExpected[argType:lower()] and not argExpected.any then
					if IsStudio then
						warn(("[Network] Invalid parameter %d to %s (%s expected, got %s)"):format(i - paramStart + 1, name, argExpected._string, argType))
					end
					return
				end
			end
			
			return fn(...)
		end
		
		return MatchParams
	end
}

function combineFn(handler, final, ...)
	local middleware = { ... }
	
	if typeof(final) == "table" then
		local info = final
		final = final[1]
		
		if info.MatchParams then
			table.insert(middleware, Middleware.MatchParams(handler.Name, info.MatchParams))
		end
	end
	
	local function NetworkHandler(...)
		if LoggingNetwork then
			local client = ...
			table.insert(LoggingNetwork[client][handler.Remote].dataIn, GetParamString(select(2, ...)))
		end
		
		local currentIndex = 1
		
		local function runMiddleware(index, ...)
			if index ~= currentIndex then
				return
			end
			
			currentIndex += 1
			
			if index <= #middleware then
				return middleware[index](function(...) return runMiddleware(index + 1, ...) end, ...)
			end
			
			return final(...)
		end
		
		return runMiddleware(1, ...)
	end
	
	return NetworkHandler
end

function Network:BindEvents(pre, callbacks)
	if typeof(pre) == "table" then
		pre, callbacks = nil, pre
	end
	
	for name,fn in pairs(callbacks) do
		local handler = GetEventHandler(name)
		if not handler then
			error(("Tried to bind callback to non-existing RemoteEvent %q"):format(name))
		end
		
		handler.Callbacks[#handler.Callbacks + 1] = combineFn(handler, fn, pre)
		
		if IsServer then
			handler.Remote.OnServerEvent:Connect(function(...)
				SafeFireEvent(handler, ...)
			end)
		else
			if handler.IncomingQueue then
				DeferredHandlers[handler] = true
			end
		end
	end
	
	ExecuteDeferredHandlers()
end

function Network:BindFunctions(pre, callbacks)
	if typeof(pre) == "table" then
		pre, callbacks = nil, pre
	end
	
	for name,fn in pairs(callbacks) do
		local handler = GetFunctionHandler(name)
		if not handler then
			error(("Tried to bind callback to non-existing RemoteFunction %q"):format(name))
		end
		
		if handler.Callback then
			error(("Tried to bind multiple callbacks to the same RemoteFunction (%s)"):format(handler.Remote:GetFullName()))
		end
		
		handler.Callback = combineFn(handler, fn, pre)
		
		if IsServer then
			handler.Remote.OnServerInvoke = function(...)
				return SafeInvokeCallback(handler, ...)
			end
		else
			if handler.IncomingQueue then
				DeferredHandlers[handler] = true
			end
		end
	end
	
	ExecuteDeferredHandlers()
end

--


if IsServer then
	function HandlerFireClient(handler, client, ...)
		if LoggingNetwork then
			table.insert(LoggingNetwork[client][handler.Remote].dataOut, GetParamString(...))
		end
		
		return handler.Remote:FireClient(client, ...)
	end
	
	--
	
	function Network:GetPlayers()
		return Players:GetPlayers()
	end

	function Network:GetPlayerPosition(player)
		return player and player.Character and player.Character.PrimaryPart and player.Character.PrimaryPart.Position or nil
	end
	
	--
	
	function Network:FireClient(client, name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		HandlerFireClient(handler, client, ...)
	end
	
	function Network:FireAllClients(name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		for i,v in pairs(self:GetPlayers()) do
			HandlerFireClient(handler, v, ...)
		end
	end
	
	function Network:FireOtherClients(client, name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		for i,v in pairs(self:GetPlayers()) do
			if v ~= client then
				HandlerFireClient(handler, v, ...)
			end
		end
	end
	
	function Network:FireOtherClientsWithinDistance(client, dist, name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		local pos = self:GetPlayerPosition(client)
		
		if not pos then
			return
		end
		
		for _,player in pairs(self:GetPlayers()) do
			if player ~= client then
				local otherPos = self:GetPlayerPosition(player)
				
				if otherPos and (pos - otherPos).Magnitude <= dist then
					HandlerFireClient(handler, player, ...)
				end
			end
		end
	end
	
	function Network:FireAllClientsWithinDistance(pos, dist, name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		for _,player in pairs(self:GetPlayers()) do
			local otherPos = self:GetPlayerPosition(player)
			
			if otherPos and (pos - otherPos).Magnitude <= dist then
				HandlerFireClient(handler, player, ...)
			end
		end
	end
	
	function Network:InvokeClientWithTimeout(timeout, client, name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		return SafeInvoke(timeout, handler, client, ...)
	end
	
	function Network:InvokeClient(...)
		return self:InvokeClientWithTimeout(60, ...)
	end
	
	
	function Network:LogTraffic(...)
		FastSpawn(self.LogTrafficAsync, self, ...)
	end
	
	function Network:LogTrafficAsync(duration, output)
		output = output or warn
		
		if LoggingNetwork then return end
		output("Logging Network Traffic...")
		
		LoggingNetwork = setmetatable({}, { __index = function(t, i)
			t[i] = setmetatable({}, { __index = function(t, i) t[i] = { dataIn = {}, dataOut = {} } return t[i] end })
			return t[i]
		end})
		
		local start = os.clock()
		wait(duration)
		local effDur = os.clock() - start
			
		local clientTraffic = LoggingNetwork
		LoggingNetwork = nil
		
		for player,remotes in pairs(clientTraffic) do
			local totalReceived = 0
			local totalSent = 0
			
			for remote,data in pairs(remotes) do
				totalReceived += #data.dataIn
				totalSent += #data.dataOut
			end
			
			output(string.format("Player '%s', total received/sent: %d/%d", player.Name, totalReceived, totalSent))
			
			for remote,data in pairs(remotes) do
				-- Incoming
				
				local list = data.dataIn
				if #list > 0 then
					output(string.format("   %s %s: %d (%.2f/s)", "FireServer", remote.Name, #list, #list / effDur))

					local count = math.min(#list, 3)
					for i = 1, count do
						local index = math.floor(1 + (i - 1) / math.max(1, count - 1) * (#list - 1) + 0.5)
						output(string.format("      %d: %s", index, list[index]))
					end
				end

				-- Outgoing
				
				local list = data.dataOut
				if #list > 0 then
					output(string.format("   %s %s: %d (%.2f/s)", "FireClient", remote.Name, #list, #list / effDur))
					
					local count = math.min(#list, 3)
					for i = 1, count do
						local index = math.floor(1 + (i - 1) / math.max(1, count - 1) * (#list - 1) + 0.5)
						output(string.format("      %d: %s", index, list[index]))
					end
				end
			end
		end
	end
else
	EventsFolder.ChildAdded:Connect(function(child) GetEventHandler(child.Name) end)
	for _,child in pairs(EventsFolder:GetChildren()) do GetEventHandler(child.Name) end
	
	FunctionsFolder.ChildAdded:Connect(function(child) GetFunctionHandler(child.Name) end)
	for _,child in ipairs(FunctionsFolder:GetChildren()) do GetFunctionHandler(child.Name) end
	
	--
	
	function Network:FireServer(name, ...)
		local handler = GetEventHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteEvent"):format(name))
		end
		
		if handler.Remote then
			handler.Remote:FireServer(...)
		else
			local params = table.pack(...)
			
			AddToQueue(handler, function()
				handler.Remote:FireServer(unpack(params))
			end, true)
		end
	end
	
	function Network:InvokeServerWithTimeout(timeout, name, ...)
		local handler = GetFunctionHandler(name)
		if not handler then
			error(("'%s' is not a valid RemoteFunction"):format(name))
		end
		
		if not handler.Remote then
			-- Code below will break if the callback passed to AddToQueue is called
			-- before the function returns. This should never happen unless somebody
			-- changed how AddToQueue works.
			local thread = coroutine.running()
			
			AddToQueue(handler, function()
				ResumeThread(thread)
			end, true)
			
			YieldThread()
		end

		local result = table.pack(SafeInvoke(timeout, handler, ...))
		assert(result[1] == true, "InvokeServer error")

		return unpack(result, 2)
	end
	
	function Network:InvokeServer(name, ...)
		return self:InvokeServerWithTimeout(nil, name, ...)
	end
end


--[[ Value packing extension ]]--

do
	local SendingCache = setmetatable({}, { __index = function(t, i) t[i] = {} return t[i] end, __mode = "k" })
	local ReceivingCache = setmetatable({}, { __index = function(t, i) t[i] = {} return t[i] end, __mode = "k" })
	local MaxStringLength = 64
	local CacheSize = 32 -- must be under 256, keeping it low because adding a new entry goes through the entire cache
	
	local ValidTypes = {
		"number", "string", "boolean", "nil",
		"Vector2", "Vector3", "CFrame",
		"Color3", "BrickColor",
		"UDim2", "UDim"
	}
	
	for i,v in ipairs(ValidTypes) do ValidTypes[v] = true end
	
	local function addEntry(value, client)
		local valueType = typeof(value)
		
		if not ValidTypes[valueType] then
			error(string.format("Invalid value passed to Network:Pack (values of type %s are not supported)", valueType))
		end
		
		if valueType == "boolean" or valueType == "nil" or value == "" then
			return value -- already one-byte
		elseif valueType == "string" and #value > MaxStringLength then
			return "\0" .. value
		end
		
		local cache = SendingCache[client]
		local info = cache[value]
		
		if not info then
			if #cache < CacheSize then
				local index = #cache + 1
				info = { char = string.char(index), value = value, last = 0 }
				
				cache[index] = info
				cache[value] = info
			else
				for i,other in ipairs(cache) do
					if not info or other.last < info.last then
						info = other
					end
				end
				
				cache[info.value] = nil
				cache[value] = info
				
				info.value = value
			end
			
			if IsServer then
				Network:FireClient(client, "SetPackedValue", info.char, info.value)
			else
				Network:FireServer("SetPackedValue", info.char, info.value)
			end
		end
		
		info.last = os.clock()
		
		return info.char
	end
	
	local function getEntry(value, client)
		local valueType = typeof(value)
		if valueType ~= "string" or value == "" then
			return value
		end
		
		local index = string.byte(value, 1)
		if index == 0 then
			return string.sub(value, 2)
		end
		
		return ReceivingCache[client][index]
	end
	
	if IsServer then
		function Network:Pack(value, client)
			assert(typeof(client) == "Instance" and client:IsA("Player"), "client is not a player")
			return addEntry(value, client)
		end
		
		function Network:Unpack(value, client)
			assert(typeof(client) == "Instance" and client:IsA("Player"), "client is not a player")
			return getEntry(value, client)
		end
		
		Network:BindEvents({
			SetPackedValue = function(client, char, value)
				if typeof(char) ~= "string" or #char ~= 1 then
					return client:Kick()
				end
				
				local index = string.byte(char)
				if index < 1 or index > CacheSize then
					return client:Kick()
				end
				
				local valueType = typeof(value)
				if not ValidTypes[valueType] or valueType == "string" and #value > MaxStringLength then
					return client:Kick()
				end
				
				ReceivingCache[client][index] = value
			end
		})
	else
		function Network:Pack(value)
			return addEntry(value, "Server")
		end
		
		function Network:Unpack(value)
			return getEntry(value, "Server")
		end
		
		Network:BindEvents({
			SetPackedValue = function(char, value)
				ReceivingCache.Server[string.byte(char)] = value
			end
		})
	end
end

--[[ Reference extension ]]--

do
	local ReferenceTypes = {
		Character = {},
		CharacterPart = {}
	}

	local References = {} 
	local Objects = {}

	for i,v in pairs(ReferenceTypes) do
		References[i] = {}
		Objects[i] = {}
	end
	
	function Network:AddReference(key, refType, ...)
		local refInfo = ReferenceTypes[refType]
		assert(refInfo, "Invalid Reference Type")
		
		local refData = {
			Type = refType,
			Reference = key,
			Objects = {...},
			Aliases = {}
		}
		
		References[refType][refData.Reference] = refData
		
		local last = Objects[refType]
		for _,obj in ipairs(refData.Objects) do
			local list = last[obj] or {}
			last[obj] = list
			last = list
		end
		
		last.__Data = refData
	end

	function Network:AddReferenceAlias(key, refType, ...)
		local refInfo = ReferenceTypes[refType]
		assert(refInfo, "Invalid Reference Type")
		
		local refData = References[refType][key]
		if not refData then
			warn("Tried to add an alias to a non-existing reference")
			return
		end
		
		local objects = {...}
		refData.Aliases[#refData.Aliases + 1] = objects
		
		local last = Objects[refType]
		for _,obj in ipairs(objects) do
			local list = last[obj] or {}
			last[obj] = list
			last = list
		end
		
		last.__Data = refData
	end

	function Network:RemoveReference(key, refType)
		local refInfo = ReferenceTypes[refType]
		assert(refInfo, "Invalid Reference Type")
		
		local refData = References[refType][key]
		if not refData then
			warn("Tried to remove a non-existing reference")
			return
		end
		
		References[refType][refData.Reference] = nil
		
		local function rem(parent, objects, index)
			if index <= #objects then
				local key = objects[index]
				local child = parent[key]
				
				rem(child, objects, index + 1)
				
				if next(child) == nil then
					parent[key] = nil
				end
			elseif parent.__Data == refData then
				parent.__Data = nil
			end
		end
		
		local objects = Objects[refData.Type]
		rem(objects, refData.Objects, 1)
		
		for i,alias in ipairs(refData.Aliases) do
			rem(objects, alias, 1)
		end
	end

	function Network:GetObject(ref, refType)
		assert(ReferenceTypes[refType], "Invalid Reference Type")
		
		local refData = References[refType][ref]
		if not refData then
			return nil
		end
		
		return unpack(refData.Objects)
	end

	function Network:GetReference(...)
		local objects = {...}
		
		local refType = table.remove(objects)
		assert(ReferenceTypes[refType], "Invalid Reference Type")
		
		local last = Objects[refType]
		for i,v in ipairs(objects) do
			last = last[v]
			
			if not last then
				break
			end
		end
		
		local refData = last and last.__Data
		return refData and refData.Reference or nil
	end
end

--

return Network