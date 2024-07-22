import Iris from "@rbxts/iris";
import { UserInputService } from "@rbxts/services";

import { CORE_GUI } from "config";
import type Input from "package/modules/iris/input";

export interface MountProps<T> {
	component: (plugin: Plugin, input: Input, props?: T) => void;
	name?: string;
	plugin: Plugin;
	props?: T;
	toolbar: PluginToolbar;
	useCoreGui: boolean;
	windowSize?: Vector2;
}

function mountAsCoreGui<T>({
	name,
	component,
	plugin,
	props,
	toolbar,
	windowSize,
}: MountProps<T>): void {
	// States
	let enabled = false;

	// Create Iris button on toolbar
	const button = toolbar.CreateButton(
		"Iris",
		"Open Iris",
		"rbxasset://textures/AnimationEditor/icon_checkmark.png",
	);
	button.ClickableWhenViewportHidden = false;

	// Create the Iris container
	const irisContainer = new Instance("ScreenGui");
	irisContainer.Name = name ?? "Iris";
	irisContainer.Parent = CORE_GUI;
	irisContainer.Enabled = false;

	// Set up Iris
	Iris.UpdateGlobalConfig({
		UseScreenGUIs: false,
	});
	Iris.Disabled = true;
	Iris.Init(irisContainer);

	// Handle the input
	const connection = UserInputService.InputBegan.Connect(inputObject => {
		if (inputObject.UserInputType !== Enum.UserInputType.Keyboard) return;
		if (inputObject.KeyCode !== Enum.KeyCode.End) return;
		if (!inputObject.IsModifierKeyDown(Enum.ModifierKey.Ctrl)) return;
		if (inputObject.UserInputState !== Enum.UserInputState.Begin) return;
		if (!enabled) return;
		irisContainer.Enabled = !irisContainer.Enabled;
	});

	// Render the component
	Iris.Connect(() => {
		Iris.Window(["Window", false, false, false, true], {
			size: windowSize ?? new Vector2(500, 750),
		});
		component(plugin, UserInputService as unknown as Input, props);
		Iris.End();
	});

	// Handle the button click
	button.Click.Connect(() => {
		enabled = !enabled;
		Iris.Disabled = !enabled;
		irisContainer.Enabled = enabled;
		button.SetActive(enabled);
	});

	// Handle plugin unload
	plugin.Unloading.Connect(() => {
		Iris.Shutdown();
		connection.Disconnect();
		enabled = false;
		button.SetActive(false);
		irisContainer.Destroy();
		Iris.Disabled = true;
	});
}

async function mountAsWidget<T>({
	name,
	component,
	plugin,
	props,
	toolbar,
}: MountProps<T>): Promise<void> {
	// States
	let enabled = false;

	// Create Iris button on toolbar
	const button = toolbar.CreateButton(
		"Iris",
		"Open Iris",
		"rbxasset://textures/AnimationEditor/icon_checkmark.png",
	);
	button.ClickableWhenViewportHidden = true;

	// Create the Iris container
	const options = new DockWidgetPluginGuiInfo(Enum.InitialDockState.Left, false, false, 500, 750);
	const widget = plugin.CreateDockWidgetPluginGui("Iris", options);
	widget.Name = name ?? "Iris";
	widget.Title = name ?? "Iris";
	widget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

	// Handle the input
	const input = (await import("package/modules/iris/input")) as Input;
	input.SinkFrame.Parent = widget;

	// Initialize Iris
	Iris.Internal._utility.UserInputService = input;
	Iris.UpdateGlobalConfig({
		UseScreenGUIs: false,
	});
	Iris.Disabled = true;
	Iris.Init(widget);

	// Render the component
	Iris.Connect(() => {
		const window = Iris.Window(["Window", false, false, false, true, true, false, true]);
		window.state.size.set(widget.AbsoluteSize);
		window.state.position.set(Vector2.zero);
		component(plugin, input, props);
		Iris.End();
	});

	widget.BindToClose(function () {
		enabled = false;
		Iris.Disabled = true;
		widget.Enabled = false;
		button.SetActive(false);
	});

	// Handle the button click
	button.Click.Connect(() => {
		enabled = !enabled;
		Iris.Disabled = !enabled;
		widget.Enabled = enabled;
		button.SetActive(enabled);
	});

	// Handle plugin unload
	plugin.Unloading.Connect(() => {
		Iris.Shutdown();
		for (const connection of input._connections) connection.Disconnect();
		input.SinkFrame.Destroy();
		enabled = false;
		widget.Enabled = false;
		Iris.Disabled = true;
		button.SetActive(false);
	});
}

export async function mountIris<T>(props: MountProps<T>): Promise<void> {
	if (props.useCoreGui) mountAsCoreGui(props);
	else mountAsWidget(props).awaitStatus();
}
