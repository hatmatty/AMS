local Helper = {}

function Helper.CombineTables(...)
	local tables = {...}

	local combined = {}
	for _,table in pairs(tables) do 
		for index,value in pairs(table) do
			combined[index] = value
		end
	end
	return combined
end

return Helper