interface ShitReload {
	flush: () => void;
	require: (module: ModuleScript) => unknown;
}
declare const shitReload: ShitReload;
export = shitReload;
