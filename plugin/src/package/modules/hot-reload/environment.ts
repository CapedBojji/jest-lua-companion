import { Signal } from "@rbxts/lemon-signal";
import { HttpService } from "@rbxts/services";

import type { Dependencies, Listeners } from "./types";
import { loadVirtualModule } from "./utils";

export class Environment {
	private activeConnections = true;
	private readonly dependencies: Dependencies = new Map();
	private readonly listeners: Listeners = new Map();

	public readonly enviromentUID: string;
	public globalInjection?: Map<unknown, unknown>;

	public shared: object = {};
	public onDependencyChanged = new Signal<[ModuleScript]>();
	private DestroyedHooked?: () => void;

	constructor() {
		const uid = HttpService.GenerateGUID(false);
		this.enviromentUID = uid;
	}

	public injectGlobal(key: unknown, value: unknown): void {
		if (this.globalInjection === undefined) this.globalInjection = new Map();

		this.globalInjection.set(key, value);
	}

	public injectEnviromentUID(): void {
		this.injectGlobal("EnviromentUID", this.enviromentUID);
	}

	public registryDependency(module: ModuleScript, result?: unknown): void {
		this.dependencies.set(module, { Result: result });
	}

	public listenDependency(module: ModuleScript): void {
		if (!this.activeConnections) return;

		const listener = module.GetPropertyChangedSignal("Source").Connect(() => {
			if (!this.activeConnections) return;
			this.onDependencyChanged.Fire(module);
		});
		this.listeners.set(module, listener);
	}

	public loadDependency(dependency: ModuleScript): unknown {
		const cached = this.dependencies.get(dependency);
		if (cached) return cached.Result;
		this.listenDependency(dependency);

		const [success, result] = loadVirtualModule(dependency, this).await();
		this.registryDependency(dependency, success ? result : undefined);

		if (success) return result;

		throw result;
	}

	public hookOnDestroyed(callback: () => void): void {
		this.DestroyedHooked = callback;
	}

	public destroy(): void {
		if (this.DestroyedHooked) this.DestroyedHooked();

		this.activeConnections = false;
		for (const [, connection] of this.listeners) connection.Disconnect();

		this.onDependencyChanged.Destroy();
	}
}
