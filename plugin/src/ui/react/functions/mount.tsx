import React, { StrictMode } from "@rbxts/react";
import type { Root } from "@rbxts/react-roblox";
import { createPortal, createRoot } from "@rbxts/react-roblox";

import { CORE_GUI } from "config";

import type { RemProviderProps } from "../providers/rem-provider";
import { RemProvider } from "../providers/rem-provider";
import { UniqueKeyProvider } from "../providers/unique-key-provider";
import { createUniqueKey } from "./create-unique-key";

interface MountProps extends RemProviderProps {
	/** The key for the UI component. */
	key: string;
}

/**
 * Mounts the UI component to the Roblox game client.
 *
 * @param root0
 * @returns The root object representing the mounted UI component.
 */
export function mountReact({ baseRem, key, remOverride, children }: MountProps): Root {
	const parent = new Instance("Folder");
	const root = createRoot(parent);
	root.render(
		<StrictMode>
			<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
				<UniqueKeyProvider generator={createUniqueKey()}>
					{createPortal(children, CORE_GUI, key)}
				</UniqueKeyProvider>
			</RemProvider>
		</StrictMode>,
	);

	return root;
}
