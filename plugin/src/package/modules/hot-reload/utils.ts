import { GLOBAL_INJECTION_KEY } from "./config";
import type { Environment } from "./environment";

/**
 * Replaces the enviroment of a loadstring'ed function.
 *
 * @param virtualModule - Function result of loadstring().
 * @param module - Module that was loaded with loadstring().
 * @param enviroment - Enviroment handler object.
 */

export function setEnviroment(
	virtualModule: Callback,
	module: ModuleScript,
	enviroment: Environment,
): void {
	const updatedEnvironment = setmetatable(
		{
			_G: enviroment.shared,
			[GLOBAL_INJECTION_KEY]: enviroment.globalInjection,
			require: (dependency: ModuleScript) => enviroment.loadDependency(dependency),
			script: module,
		},
		{
			// defaults any global variables to the current global enviroment
			__index: getfenv(),
		},
	);
	setfenv(virtualModule, updatedEnvironment);
}

/**
 * Requires a module by using loadstring, this also replaces the _G table and
 * the function "require()".
 *
 * @param module - The module to laod.
 * @param enviroment - Enviroment handler object.
 * @returns Nothing.
 */
export async function loadVirtualModule(
	module: ModuleScript,
	enviroment: Environment,
): Promise<unknown> {
	const [virtualModule, err] = loadstring(module.Source, module.Name);

	if (virtualModule === undefined) throw err;

	setEnviroment(virtualModule, module, enviroment);
	const [sucess, result] = pcall(virtualModule);
	if (sucess) return result as unknown;

	throw result;
}
