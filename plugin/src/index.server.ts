import type { AggregatedResult, runCLI } from "@rbxts/jest";
import type { GlobalConfig } from "@rbxts/jest/src/config";
import { HttpService, LogService } from "@rbxts/services";

import { APPLICATION_JSON, PLACE_GUID, PLACE_ID, PLACE_NAME } from "config";
import { URL_ENDPOINTS, URL_PORT } from "config/url";
import shitReload from "package/modules/hot-reload/shit-reload";
import Tree from "package/modules/tree";
import { $warn } from "rbxts-transform-debug";
import type { LogData } from "types";
import type { GetTestDataUrlResponse } from "types/url";

function getInstanceFromPath(path: string): Instance | undefined {
	const parts = path.split("/");
	let instance: Instance | undefined = game;
	for (const part of parts) {
		instance = instance.FindFirstChild(part);
		if (instance === undefined) return undefined;
	}

	return instance;
}

function getTestData(): GetTestDataUrlResponse | undefined {
	const url =
		`http://localhost:${URL_PORT}/${URL_ENDPOINTS.getTestDataUrl}?` +
		`placeId=${PLACE_ID}&placeName=${PLACE_NAME}&placeGuid=${PLACE_GUID}`;
	const [ok, response] = pcall(() => HttpService.RequestAsync({ Method: "GET", Url: url }));
	if (!ok || response.StatusCode !== 200 || response.Body === "") {
		$warn("Failed to get test roots", response);
		return undefined;
	}

	return HttpService.JSONDecode(response.Body) as GetTestDataUrlResponse;
}

function postLog(message: string, messageType: Enum.MessageType): void {
	const url = `http://localhost:${URL_PORT}/${URL_ENDPOINTS.postLogUrl}`;
	const body = HttpService.JSONEncode({ message, messageType });
	const header = { "Content-Type": APPLICATION_JSON };
	pcall(() => {
		return HttpService.RequestAsync({ Body: body, Headers: header, Method: "POST", Url: url });
	});
}

while (true) {
	task.wait();
	const data = getTestData();
	if (data === undefined) continue;

	LogService.ClearOutput();
	const logConnection = LogService.MessageOut.Connect(postLog);

	const root = getInstanceFromPath(data.projectRoot);
	if (root === undefined) continue;
	const projects = data.projects.map(path => getInstanceFromPath(path)).filterUndefined();

	// Notify the server that the tests are starting
	postLog(
		`%[RUN_CLI-LOG]% ${HttpService.JSONEncode({ message: "Started Test" } as LogData)}`,
		Enum.MessageType.MessageInfo,
	);
	shitReload.flush();
	const cli = (
		shitReload.require(
			Tree.Find(script, "include/node_modules/@rbxts/jest/src") as ModuleScript,
		) as { runCli: typeof runCLI }
	).runCli;
	const [status, err] = cli(
		root,
		{
			...data,
			setupFiles: [Tree.Await(script, "package/modules/reset-ts-runtime") as ModuleScript],
		},
		projects,
	).awaitStatus();

	// Notify the server of rejection
	if (status === "Rejected") {
		const url = `http://localhost:${URL_PORT}/${URL_ENDPOINTS.postResultsUrl}`;
		const header = { "Content-Type": APPLICATION_JSON };
		const body = HttpService.JSONEncode({ err, status });
		pcall(() => {
			return HttpService.RequestAsync({
				Body: body,
				Headers: header,
				Method: "POST",
				Url: url,
			});
		});
	}

	if (status === "Resolved") {
		const [results, config] = err as [AggregatedResult, GlobalConfig];
		const url = `http://localhost:${URL_PORT}/${URL_ENDPOINTS.postResultsUrl}`;
		const header = { "Content-Type": APPLICATION_JSON };
		const body = HttpService.JSONEncode({ config, results, status });
		pcall(() => {
			return HttpService.RequestAsync({
				Body: body,
				Headers: header,
				Method: "POST",
				Url: url,
			});
		});
	}

	logConnection.Disconnect();
	postLog(
		`%[RUN_CLI-LOG]% ${HttpService.JSONEncode({ message: "Test Finished" } as LogData)}`,
		Enum.MessageType.MessageInfo,
	);
}
