import type { HotReloader } from ".";
import type { Environment } from "./environment";

export type Dependencies = Map<ModuleScript, { Result: unknown }>;
export type Listeners = Map<ModuleScript, RBXScriptConnection>;

declare global {
	interface HotReloaderError {
		Error: string;
		Sucess: false;
	}
	interface HotReloaderSucess {
		Result: unknown;
		Sucess: true;
	}
	interface HotReloaderIntrinsic {
		Reloader: HotReloader;
	}

	type HotReloaderResult = (HotReloaderError | HotReloaderSucess) & HotReloaderIntrinsic;
}

export type ReloadBinder = (enviroment: Environment) => void;
