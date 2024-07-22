import { createProducer } from "@rbxts/reflex";

import { defaultTheme } from "ui/react/themes/default-theme";

export const themeSlice = createProducer(defaultTheme, {});
