export {};
if (math.random(0, 100) > -1) {
	error("E DONT RUN");
}

const FireEvent = new Instance("RemoteEvent");
FireEvent.Parent = script.Parent;

FireEvent.OnServerEvent.Connect((player, ray) => {
	if (ray === undefined || !typeIs(ray, "Ray")) {
		error();
	}
});
