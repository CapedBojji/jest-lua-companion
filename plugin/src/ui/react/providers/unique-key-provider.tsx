import type { Element, PropsWithChildren, Provider } from "@rbxts/react";
import React, { createContext } from "@rbxts/react";

import type { createUniqueKey } from "../functions";

export const UniqueKeyContext = createContext<((name: string) => string) | undefined>(undefined);

export function UniqueKeyProvider({
	generator,
	children,
}: PropsWithChildren<{ generator: (name: string) => string }>): Element<
	Provider<typeof createUniqueKey>
> {
	return <UniqueKeyContext.Provider value={generator}>{children}</UniqueKeyContext.Provider>;
}
