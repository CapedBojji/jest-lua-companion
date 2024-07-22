import { Workspace } from "@rbxts/services";

export function screenPointRaycast(
	screenPoint: Vector2,
	filterInfo?: [Array<Instance>, Enum.RaycastFilterType],
): RaycastResult | undefined {
	const camera = Workspace.CurrentCamera;
	const rayMultiplier = 1000;
	if (!camera) throw "No camera found";
	const ray = camera.ScreenPointToRay(screenPoint.X, screenPoint.Y);
	const parameters = new RaycastParams();
	if (filterInfo) {
		const [instances, filterType] = filterInfo;
		for (const instance of instances) parameters.AddToFilter(instance);
		parameters.FilterType = filterType;
	}

	return Workspace.Raycast(ray.Origin, ray.Direction.mul(rayMultiplier), parameters);
}

export function getScreenRay(screenPoint: Vector2): Ray {
	const camera = Workspace.CurrentCamera;
	if (!camera) throw "No camera found";
	return camera.ScreenPointToRay(screenPoint.X, screenPoint.Y);
}
