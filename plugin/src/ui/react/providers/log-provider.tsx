import type { Logger } from "@rbxts/log";
import Log from "@rbxts/log";
import type { Element, PropsWithChildren, Provider } from "@rbxts/react";
import React, { createContext } from "@rbxts/react";

export const LogContext = createContext<Logger | undefined>(undefined);

export function LogProvider({
	context,
	children,
}: PropsWithChildren<{ readonly context: string }>): Element<Provider<Logger>> {
	return (
		<LogContext.Provider
			value={Log.ForContext({
				toString() {
					return context;
				},
			})}
		>
			{children}
		</LogContext.Provider>
	);
}
