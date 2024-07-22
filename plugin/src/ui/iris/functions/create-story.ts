import Iris from "@rbxts/iris";

import type Input from "package/modules/iris/input";

export interface IrisStoryProps {
	component: (...args: Array<unknown>) => void;
	componentProps?: Array<unknown>;
	parent: GuiObject;
}

export async function createIrisStory(props: IrisStoryProps): Promise<() => void> {
	const input = (await import("package/modules/iris/input")) as Input;
	input.SinkFrame.Parent = props.parent;

	Iris.Internal._utility.UserInputService = input;
	Iris.UpdateGlobalConfig({
		UseScreenGUIs: false,
	});
	Iris.Init(props.parent);
	Iris.Connect(() => {
		Iris.ShowDemoWindow();
		if (props.componentProps !== undefined) props.component(...props.componentProps);
		else props.component();
	});
	return () => {
		Iris.Shutdown();
		for (const connection of input._connections) connection.Disconnect();
		input.SinkFrame.Destroy();
	};
}
