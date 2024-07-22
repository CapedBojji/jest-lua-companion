// eslint-disable-next-line ts/naming-convention -- Required for Roblox global override.
interface _G {
	[key: string]: unknown;
	/** Enable React dev mode. */
	__DEV__: boolean;

	/** Enable React profiling mode. */
	__PROFILE__: boolean;
}
