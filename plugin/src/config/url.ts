import { $env } from "rbxts-transform-env";

export const URL_ENDPOINTS = {
	getTestDataUrl: $env.string("TEST_DATA_URL") ?? "test-roots",
	postLogUrl: $env.string("LOG_URL") ?? "log",
	postResultsUrl: $env.string("RESULTS_URL") ?? "return-results",
};

export const URL_PORT = $env.number("PORT") ?? 23490;
