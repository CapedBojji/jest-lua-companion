import type { Element } from "@rbxts/react";
import React from "@rbxts/react";

import Frame from "./primitives/frame";
import Layer from "./primitives/layer";

export function App(): Element {
	return (
		<Layer>
			<Frame
				Native={{ Position: new UDim2(0.5, 0, 0.5, 0), Size: new UDim2(0, 100, 0, 100) }}
			/>
		</Layer>
	);
}
