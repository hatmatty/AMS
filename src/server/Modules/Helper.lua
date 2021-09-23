local Helper = {}

function Helper.CombineTables(...)
	local tables = {...}
	local combined = {}

	for _,t in pairs(tables) do
		for _,v in pairs(t) do
			table.insert(combined,v)
		end
	end

	return combined
end

return Helper