import { selectTheme } from "store/selectors/theme";
import type { Theme } from "types/theme";

import { useRootSelector } from "../providers/reflex-provider";

export function useTheme(): Theme {
	return useRootSelector(selectTheme);
}
