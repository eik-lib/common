import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname, sep } from "node:path";
import os from "node:os";
import { test } from "node:test";
import assert from "node:assert/strict";
import configStore from "../../lib/helpers/config-store.js";
import EikConfig from "../../lib/classes/eik-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function mkdirTempDir() {
	return fs.mkdtemp(join(os.tmpdir(), "eik-config"));
}

const mockEikJSON = (/** @type {Record<string, unknown>} */ data = {}) => ({
	name: "magarita",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
	...data,
});

const mockPackageJSON = ({
	name = "magarita",
	version = "0.0.0",
	other = {},
	eik = {},
}) => ({
	name,
	version,
	...other,
	eik: {
		server: "http://server",
		files: { "/": "pizza" },
		...eik,
	},
});

test("loads from package.json", () => {
	const config = configStore.findInDirectory(`${sep}pizza dir`, (path) => {
		if (path.includes("eik.json") || path.includes(".eikrc")) return null;
		assert.ok(path.includes(`${sep}pizza dir${sep}package.json`));
		return mockPackageJSON({
			other: { notIncluded: "fish" },
			eik: { "import-map": "http://map" },
		});
	});
	assert.strictEqual(config.name, "magarita");
	assert.strictEqual(config.version, "0.0.0");
	// @ts-ignore
	assert.strictEqual(config.notIncluded, undefined);
	assert.deepStrictEqual(config.map, ["http://map"]);
});

test("loads from eik.json", () => {
	const config = configStore.findInDirectory(`${sep}pizza dir`, (path) => {
		if (path.includes("package.json") || path.includes(".eikrc")) return null;
		assert.ok(path.includes(`${sep}pizza dir${sep}eik.json`));
		return mockEikJSON();
	});
	assert.strictEqual(config.name, "magarita");
});

test("loads eik.json from an exact path", () => {
	const config = configStore.loadFromPath(
		"/exact/pizza/dir/eik.json",
		(path) => {
			if (path.includes("package.json") || path.includes(".eikrc")) return null;
			assert.ok(path.includes("/exact/pizza/dir/eik.json"));
			return mockEikJSON();
		},
	);
	assert.strictEqual(config.name, "magarita");
});

test("loads from eik.json - invalid config", () => {
	try {
		configStore.findInDirectory(`${sep}pizza dir`, (path) => {
			if (path.includes("package.json") || path.includes(".eikrc")) return null;
			return {};
		});
	} catch (err) {
		assert.ok(
			`${err}`.includes(
				`InvalidConfigError: Eik config object was invalid: 'config.findInDirectory operation failed: Invalid eik.json schema: must have required property 'server'`,
			),
		);
	}
});

test("package.json and eik.json not being present", () => {
	try {
		configStore.findInDirectory(`${sep}pizza dir`, () => null);
	} catch (e) {
		assert.strictEqual(
			e instanceof Error ? e.message : String(e),
			`No package.json or eik.json file found in: '${sep}pizza dir'`,
		);
	}
});

test("package.json and eik.json both have eik config", () => {
	const jsonReaderStub = (/** @type {string} */ path) => {
		if (path.includes("package.json")) return { eik: { pizza: "magarita" } };
		return {};
	};
	try {
		configStore.findInDirectory(`${sep}pizza dir`, jsonReaderStub);
	} catch (e) {
		assert.strictEqual(
			e instanceof Error ? e.message : String(e),
			"Eik configuration was defined in both in package.json and eik.json. You must specify one or the other.",
		);
	}
});

test("name is pulled from package.json if not defined in eik.json", () => {
	const jsonReaderStub = (/** @type {string} */ path) => {
		if (path.includes("package.json"))
			return {
				name: "big pizza co",
				version: "0.0.0",
				eik: {
					server: "https://test",
					files: {
						"/": "./dist/**/*.js",
					},
				},
			};
		if (path.includes("eik.json")) return null;
		return {};
	};
	const config = configStore.findInDirectory(`${sep}pizza dir`, jsonReaderStub);
	assert.strictEqual(config.name, "big pizza co");
	assert.strictEqual(config.version, "0.0.0");
	assert.strictEqual(config.server, "https://test");
	assert.deepStrictEqual(config.files, {
		"/": "./dist/**/*.js",
	});
});

test("tokens are present", () => {
	const config = configStore.findInDirectory(`${sep}pizza dir`, (path) => {
		if (path.includes("eik.json")) return mockEikJSON();
		if (path.includes(".eikrc"))
			return { tokens: [["http://server", "muffins"]] };
		return {};
	});
	assert.strictEqual(config.server, "http://server");
	assert.strictEqual(config.token, "muffins");
});

test("invalid json error", () => {
	const jsonReaderStub = (/** @type {string} */ path) => {
		if (path.includes(".json")) JSON.parse("not json");
		return {};
	};

	try {
		configStore.findInDirectory(`${sep}pizza dir`, jsonReaderStub);
	} catch (e) {
		assert.ok(
			(e instanceof Error ? e.message : String(e)).includes("Unexpected token"),
		);
	}
});

test("no configuration present", () => {
	try {
		configStore.findInDirectory(`${sep}pizza dir`, () => {});
	} catch (e) {
		assert.strictEqual(
			e instanceof Error ? e.message : String(e),
			`No package.json or eik.json file found in: '${sep}pizza dir'`,
		);
	}
});

test("reading without stubbed json", () => {
	const config = configStore.findInDirectory(__dirname);
	assert.strictEqual(config.name, "my-app");
});

test("saves config to disk", async () => {
	const path = await mkdirTempDir();
	const config = new EikConfig(
		{
			name: "magarita",
			server: "http://server",
			files: { "/": "pizza" },
			version: "0.0.0",
			out: "./biscuits",
		},
		null,
		path,
	);

	// @ts-ignore
	configStore.persistToDisk(config);

	const persistedConfig = configStore.findInDirectory(path);
	assert.strictEqual(persistedConfig.out, "biscuits");
});

test("saves config to disk - invalid config - passed config not a instance of EikConfig", async () => {
	const config = {};
	try {
		// @ts-ignore
		configStore.persistToDisk(config);
	} catch (err) {
		assert.ok(
			`${err}`.includes(
				`InvalidConfigError: Eik config object was invalid: 'config.persistToDisk operation failed: config.validate is not a function'`,
			),
		);
	}
});

test("saves config to disk - invalid config", async () => {
	const config = new EikConfig(null);
	try {
		// @ts-ignore
		configStore.persistToDisk(config);
	} catch (err) {
		assert.ok(
			`${err}`.includes(
				`InvalidConfigError: Eik config object was invalid: 'config.persistToDisk operation failed: Invalid eik.json schema: must have required property 'server'`,
			),
		);
	}
});
