import { $NODE_ENV } from "rbxts-transform-env";

export function reactConfig(): void {
	if ($NODE_ENV !== "development") return;

	_G.__DEV__ = true;
	_G.__PROFILE__ = true;

	void import("ui/react/functions/profiler").then(({ profileAllComponents }) => {
		profileAllComponents();
	});
}

export async function createApp(): Promise<void> {
	// Avoid implicit React import before setting the __DEV__ flag
	const React = await import("@rbxts/react");
	const { App } = await import("./components/app");
	const { mountReact } = await import("./functions/mount");

	mountReact({ key: "App", children: <App /> });
}
