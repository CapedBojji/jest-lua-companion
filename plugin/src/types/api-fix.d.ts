// Some functions that were missing in Roblox-TS

declare function loadstring(s: string, n?: string): LuaTuple<[Callback?, string?]>;
declare function getfenv(): { script: LuaSourceContainer };
declare function setfenv(f: Callback, environment: object): void;
declare function newproxy(): string;

interface NewLuaMetatable<T> {
	__add?: (self: T, other: T) => T;
	__call?: (self: T, ...args: Array<unknown>) => void;
	__concat?: (self: T, ...args: Array<unknown>) => string;
	__div?: (self: T, other: T) => T;
	__eq?: (self: T, other: T) => boolean;
	__index?: ((self: T, index: unknown) => void) | { [K in string]: unknown };
	__le?: (self: T, other: T) => boolean;
	__len?: (self: T) => number;
	__lt?: (self: T, other: T) => boolean;
	__metatable?: string;
	__mod?: (self: T, other: T) => T;
	__mode?: "k" | "kv" | "v";
	__mul?: (self: T, other: T) => T;
	__newindex?: (self: T, index: unknown, value: unknown) => void;
	__pow?: (self: T, other: T) => T;
	__sub?: (self: T, other: T) => T;
	__tostring?: (self: T) => string;
	__unm?: (self: T) => T;
}

declare function setmetatable<T extends object>(object: T, metatable: NewLuaMetatable<T>): T;
