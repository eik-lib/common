import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname, sep } from "node:path";
import os from "node:os";
import { test } from "tap";
import configStore from "../../lib/helpers/config-store.js";
import EikConfig from "../../lib/classes/eik-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function mkdirTempDir() {
	return fs.mkdtemp(join(os.tmpdir(), "eik-config"));
}

const mockEikJSON = (data) => ({
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

test("loads from package.json", (t) => {
	const config = configStore.findInDirectory(`${sep}pizza dir`, (path) => {
		if (path.includes("eik.json") || path.includes(".eikrc")) return null;
		t.match(path, `${sep}pizza dir${sep}package.json`);
		return mockPackageJSON({
			other: { notIncluded: "fish" },
			eik: { "import-map": "http://map" },
		});
	});
	t.equal(config.name, "magarita");
	t.equal(config.version, "0.0.0");
	// @ts-ignore
	t.equal(config.notIncluded, undefined);
	t.same(config.map, ["http://map"]);
	t.end();
});

test("loads from eik.json", (t) => {
	const config = configStore.findInDirectory(`${sep}pizza dir`, (path) => {
		if (path.includes("package.json") || path.includes(".eikrc")) return null;
		t.match(path, `${sep}pizza dir${sep}eik.json`);
		return mockEikJSON();
	});
	t.equal(config.name, "magarita");
	t.end();
});

test("loads eik.json from an exact path", (t) => {
	const config = configStore.loadFromPath(
		"/exact/pizza/dir/eik.json",
		(path) => {
			if (path.includes("package.json") || path.includes(".eikrc")) return null;
			t.match(path, "/exact/pizza/dir/eik.json");
			return mockEikJSON();
		},
	);
	t.equal(config.name, "magarita");
	t.end();
});

test("loads from eik.json - invalid config", (t) => {
	try {
		configStore.findInDirectory(`${sep}pizza dir`, (path) => {
			if (path.includes("package.json") || path.includes(".eikrc")) return null;
			return {};
		});
	} catch (err) {
		t.match(
			`${err}`,
			`InvalidConfigError: Eik config object was invalid: 'config.findInDirectory operation failed: Invalid eik.json schema: must have required property 'server'`,
		);
	}
	t.end();
});

test("package.json and eik.json not being present", (t) => {
	t.plan(1);
	try {
		configStore.findInDirectory(`${sep}pizza dir`, () => null);
	} catch (e) {
		t.equal(
			e.message,
			`No package.json or eik.json file found in: '${sep}pizza dir'`,
		);
	}
	t.end();
});

test("package.json and eik.json both have eik config", (t) => {
	t.plan(1);
	const jsonReaderStub = (path) => {
		if (path.includes("package.json")) return { eik: { pizza: "magarita" } };
		return {};
	};
	try {
		configStore.findInDirectory(`${sep}pizza dir`, jsonReaderStub);
	} catch (e) {
		t.equal(
			e.message,
			"Eik configuration was defined in both in package.json and eik.json. You must specify one or the other.",
		);
	}

	t.end();
});

test("name is pulled from package.json if not defined in eik.json", (t) => {
	const jsonReaderStub = (path) => {
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
	t.equal(config.name, "big pizza co");
	t.equal(config.version, "0.0.0");
	t.equal(config.server, "https://test");
	t.same(config.files, {
		"/": "./dist/**/*.js",
	});
	t.end();
});

test("tokens are present", (t) => {
	const config = configStore.findInDirectory(`${sep}pizza dir`, (path) => {
		if (path.includes("eik.json")) return mockEikJSON();
		if (path.includes(".eikrc"))
			return { tokens: [["http://server", "muffins"]] };
		return {};
	});
	t.equal(config.server, "http://server");
	t.equal(config.token, "muffins");
	t.end();
});

test("invalid json error", (t) => {
	t.plan(1);
	const jsonReaderStub = (path) => {
		if (path.includes(".json")) JSON.parse("not json");
		return {};
	};

	try {
		configStore.findInDirectory(`${sep}pizza dir`, jsonReaderStub);
	} catch (e) {
		t.match(e.message, /Unexpected token/);
	}
	t.end();
});

test("no configuration present", (t) => {
	t.plan(1);
	try {
		configStore.findInDirectory(`${sep}pizza dir`, () => {});
	} catch (e) {
		t.equal(
			e.message,
			`No package.json or eik.json file found in: '${sep}pizza dir'`,
		);
	}
	t.end();
});

test("reading without stubbed json", (t) => {
	const config = configStore.findInDirectory(__dirname);
	t.equal(config.name, "my-app");
	t.end();
});

test("saves config to disk", async (t) => {
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
	t.equal(persistedConfig.out, "biscuits");
	t.end();
});

test("saves config to disk - invalid config - passed config not a instance of EikConfig", async (t) => {
	const config = {};
	try {
		// @ts-ignore
		configStore.persistToDisk(config);
	} catch (err) {
		t.match(
			`${err}`,
			`InvalidConfigError: Eik config object was invalid: 'config.persistToDisk operation failed: config.validate is not a function'`,
		);
	}

	t.end();
});

test("saves config to disk - invalid config", async (t) => {
	const config = new EikConfig(null);
	try {
		// @ts-ignore
		configStore.persistToDisk(config);
	} catch (err) {
		t.match(
			`${err}`,
			`InvalidConfigError: Eik config object was invalid: 'config.persistToDisk operation failed: Invalid eik.json schema: must have required property 'server'`,
		);
	}

	t.end();
});
