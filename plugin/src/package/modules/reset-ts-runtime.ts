import Object from "@rbxts/object-utils";

for (const [key] of Object.entries(_G))
	if (typeOf(key) === "Instance" && (key as unknown as Instance).IsA("ModuleScript"))
		_G[key] = undefined;
