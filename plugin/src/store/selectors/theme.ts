import type { RootState } from "store";
import type { Theme } from "types/theme";

export function selectTheme(state: RootState): Theme {
	return state.theme;
}
