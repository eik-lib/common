import { test } from "node:test";
import assert from "node:assert/strict";
import schemas from "../../lib/schemas/index.js";

const { assert: schemaAssert } = schemas;

test("assert basic eik JSON file", () => {
	assert.doesNotThrow(() => {
		schemaAssert.eikJSON({
			name: "my-app-name",
			version: "1.0.0",
			server: "http://localhost:4001",
			files: {
				"index.js": "./assets/scripts.js",
				"index.css": "./assets/styles.css",
			},
		});
	});
});

test("assert eik JSON file - mutation does not occur", () => {
	const data = {
		name: "my-app-name",
		version: "1.0.0",
		server: "http://localhost:4001",
		files: {
			"index.js": "./assets/scripts.js",
			"index.css": "./assets/styles.css",
		},
	};

	schemaAssert.eikJSON(data);

	assert.deepStrictEqual(data, {
		name: "my-app-name",
		version: "1.0.0",
		server: "http://localhost:4001",
		files: {
			"index.js": "./assets/scripts.js",
			"index.css": "./assets/styles.css",
		},
	});
});

test("assert asset manifest - all props invalid", () => {
	assert.throws(() => {
		// @ts-expect-error Testing bad input
		schemaAssert.eikJSON({
			name: "",
		});
	});
});

test("assert name: empty string", () => {
	assert.throws(() => {
		schemaAssert.name("");
	});
});

test("assert name: valid", () => {
	assert.doesNotThrow(() => {
		schemaAssert.name("@finn-no/my-app");
	});
});

test("assert name: invalid by assert-npm-package-name module", () => {
	assert.throws(() => {
		schemaAssert.name("@finn-no/my-app~");
	});
});

test("assert version: empty string", () => {
	assert.throws(() => {
		schemaAssert.version("");
	});
});

test("assert version: valid", () => {
	assert.doesNotThrow(() => {
		schemaAssert.version("1.0.0");
	});
});

test("assert type: invalid", () => {
	try {
		schemaAssert.type("foo");
	} catch (err) {
		assert.strictEqual(
			err instanceof Error ? err.message : String(err),
			'Parameter "type" is not valid: must be equal to one of the allowed values ("package", "npm", "map", "image")',
		);
	}
});

test("assert type: valid - package", () => {
	assert.doesNotThrow(() => {
		schemaAssert.type("package");
	});
});

test("assert type: valid - npm", () => {
	assert.doesNotThrow(() => {
		schemaAssert.type("npm");
	});
});

test("assert type: valid - map", () => {
	assert.doesNotThrow(() => {
		schemaAssert.type("map");
	});
});

test("assert version: invalid by node-semver module", () => {
	assert.throws(() => {
		schemaAssert.version("1.0");
	});
});

test("assert server: valid", () => {
	assert.doesNotThrow(() => {
		schemaAssert.server("http://localhost:4000");
	});
});

test("assert server: invalid", () => {
	assert.throws(() => {
		schemaAssert.server("localhost");
	});
});

test("assert files: valid", () => {
	assert.doesNotThrow(() => {
		schemaAssert.files({ "index.js": "/path/to/file.js" });
	});
});

test("assert files: invalid", () => {
	assert.throws(() => {
		// @ts-expect-error Testing bad input
		schemaAssert.files({ asd: 1 });
	});
});

test("assert files: invalid (empty object)", () => {
	assert.throws(() => {
		schemaAssert.files({});
	});
});

test("assert importMap: valid string", () => {
	assert.doesNotThrow(() => {
		schemaAssert.importMap("http://myimportmap/file.json");
	});
});

test("assert importMap: valid array", () => {
	assert.doesNotThrow(() => {
		schemaAssert.importMap([
			"http://myimportmap/file1.json",
			"http://myimportmap/file2.json",
		]);
	});
});

test("assert importMap: invalid string", () => {
	assert.throws(() => {
		schemaAssert.importMap("");
	});
});

test("assert importMap: invalid array", () => {
	assert.throws(() => {
		schemaAssert.importMap([""]);
	});
});

test("assert out: valid", () => {
	assert.doesNotThrow(() => {
		schemaAssert.out("./.eik");
	});
});

test("assert out: invalid", () => {
	assert.throws(() => {
		schemaAssert.out("");
	});
});
