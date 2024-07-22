import React from "@rbxts/react";

import { UniqueKeyContext } from "../providers/unique-key-provider";

export function useUniqueKey(): (name: string) => string {
	const generator = React.useContext(UniqueKeyContext);
	if (generator === undefined) error("useUniqueKey must be used within a UniqueKeyProvider");
	return generator;
}
