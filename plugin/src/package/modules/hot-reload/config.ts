import { $env } from "rbxts-transform-env";

export const GLOBAL_INJECTION_KEY =
	$env.string("GLOBAL_INJECTION_KEY") ?? "__hotreload_env_global_injection__";
