import type { Logger } from "@rbxts/log";
import React from "@rbxts/react";

import { LogContext } from "../providers/log-provider";

export function useLogger(): Logger {
	const logger = React.useContext(LogContext);
	if (logger === undefined) throw "useLogger must be used within a LogProvider";
	return logger;
}
