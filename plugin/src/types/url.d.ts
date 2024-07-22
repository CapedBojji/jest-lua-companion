export interface GetTestDataUrlResponse {
	ci?: boolean;
	clearMocks?: boolean;
	debug?: boolean;
	expand?: boolean;
	json?: boolean;
	listTests?: boolean;
	noStackTrace?: boolean;
	passWithNoTests?: boolean;
	projectRoot: string;
	projects: Array<string>;
	resetMocks?: boolean;
	showConfig?: boolean;
	testMatch?: Array<string>;
	testNamePattern?: string;
	testPathIgnorePatterns?: Array<string>;
	testPathPattern?: Array<string>;
	testTimeout?: number;
	updateSnapshot?: boolean;
	verbose?: boolean;
}
