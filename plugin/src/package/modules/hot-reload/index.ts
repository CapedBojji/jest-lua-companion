import { Signal } from "@rbxts/lemon-signal";

import { Environment } from "./environment";
import type { ReloadBinder } from "./types";

export class HotReloader {
	/**
	 * Requires the module and returns a promise that resolves when loaded, and
	 * the hot-reloader object.
	 *
	 * @param module - The module to reload.
	 * @returns [Result: Promise<Result>, Reloader: HotReloader].
	 */

	public readonly module: ModuleScript;

	private environment?: Environment;
	private reloadPromise: Promise<unknown> | undefined;
	private environmentListener?: RBXScriptConnection;
	public readonly onReloadStarted: Signal<[Promise<unknown>]>;
	private reloadBinder?: ReloadBinder;

	public isAutoReloadEnabled = true;

	constructor(module: ModuleScript) {
		this.module = module;
		this.onReloadStarted = new Signal();
	}

	private cleanReloader(): void {
		if (this.reloadPromise) this.reloadPromise.cancel();
		if (this.environmentListener?.Connected !== undefined) {
			this.environmentListener.Disconnect();
			this.environmentListener = undefined;
		}

		if (this.environment !== undefined) {
			this.environment.destroy();
			this.environment = undefined;
		}
	}

	public bindToReloading(bind: ReloadBinder): void {
		this.reloadBinder = bind;
	}

	private runReloadBinder(environment: Environment): void {
		if (this.reloadBinder) this.reloadBinder(environment);
	}

	public async reload(): Promise<unknown> {
		this.cleanReloader();
		const enviroment = new Environment();
		this.environment = enviroment;
		this.runReloadBinder(enviroment);

		const listener = enviroment.onDependencyChanged.Once(() => {
			if (!this.isAutoReloadEnabled) return;
			this.reload().await();
		});
		this.environmentListener = listener;

		const handler = Promise.try(() => enviroment.loadDependency(this.module));
		this.reloadPromise = handler;
		this.onReloadStarted.Fire(handler);
		return handler;
	}

	public destroy(): void {
		this.cleanReloader();
	}
}
