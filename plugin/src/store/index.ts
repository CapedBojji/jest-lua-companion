import { LogLevel } from "@rbxts/log";
import type { InferState } from "@rbxts/reflex";
import { combineProducers, loggerMiddleware } from "@rbxts/reflex";

import { LOG_LEVEL } from "package/functions/setup-logger";
import { $NODE_ENV } from "rbxts-transform-env";

import { slices } from "./slices";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore(): typeof store {
	const store = combineProducers({
		...slices,
	});

	// Log reflex actions only when verbose logging is enabled.
	if ($NODE_ENV === "development" && LOG_LEVEL === LogLevel.Verbose)
		store.applyMiddleware(loggerMiddleware);

	return store;
}

/**
 * The Reflex store for the application.
 *
 * @see https://littensy.github.io/reflex/
 */
export const store = createStore();
