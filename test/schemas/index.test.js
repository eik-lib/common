import { test } from "node:test";
import assert from "node:assert/strict";
import schemas from "../../lib/schemas/index.js";

const { validate } = schemas;

test("validate basic eik JSON file", () => {
	const result = validate.eikJSON({
		name: "my-app-name",
		version: "1.0.0",
		server: "http://localhost:4001",
		files: {
			"index.js": "./assets/scripts.js",
			"index.css": "./assets/styles.css",
		},
	});
	assert.strictEqual(result.value.type, "package");
	assert.strictEqual(result.error, false);
});

test("validate asset manifest - all props invalid", () => {
	// @ts-expect-error Testing bad input
	const result = validate.eikJSON({
		name: "",
	});

	assert.deepStrictEqual(result.value, { name: "", type: "package" });
	assert.strictEqual(
		Array.isArray(result.error) ? result.error[0].message : undefined,
		`must have required property 'server'`,
	);
});

test("validate name: empty string", () => {
	const result = validate.name("");
	assert.strictEqual(result.value, "");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
});

test("validate name: valid", () => {
	const result = validate.name("@finn-no/my-app");
	assert.strictEqual(result.value, "@finn-no/my-app");
	assert.strictEqual(result.error, false);
});

test("validate name: invalid by validate-npm-package-name module", () => {
	const result = validate.name("@finn-no/my-app~");
	assert.strictEqual(result.value, "@finn-no/my-app~");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
});

test("validate version: empty string", () => {
	const result = validate.version("");
	assert.strictEqual(result.value, "");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
});

test("validate version: valid", () => {
	const result = validate.version("1.0.0");
	assert.strictEqual(result.value, "1.0.0");
	assert.strictEqual(result.error, false);
});

test("validate type: empty string", () => {
	const result = validate.type("");
	assert.strictEqual(result.value, "");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
	assert.strictEqual(
		Array.isArray(result.error) ? result.error[0].message : undefined,
		"must be equal to one of the allowed values",
	);
});

test("validate type: valid - package", () => {
	const result = validate.type("package");
	assert.strictEqual(result.value, "package");
	assert.strictEqual(result.error, false);
});

test("validate type: valid - npm", () => {
	const result = validate.type("npm");
	assert.strictEqual(result.value, "npm");
	assert.strictEqual(result.error, false);
});

test("validate type: valid - map", () => {
	const result = validate.type("map");
	assert.strictEqual(result.value, "map");
	assert.strictEqual(result.error, false);
});

test("validate version: invalid by node-semver module", () => {
	const result = validate.version("1.0");
	assert.strictEqual(result.value, "1.0");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
});

test("validate server: valid", () => {
	const result = validate.server("http://localhost:4000");
	assert.strictEqual(result.value, "http://localhost:4000");
	assert.strictEqual(result.error, false);
});

test("validate server: invalid", () => {
	const result = validate.server("localhost");
	assert.strictEqual(result.value, "localhost");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
});

test("validate files: valid", () => {
	const result = validate.files({ "index.js": "/path/to/file.js" });
	assert.deepStrictEqual(result.value, { "index.js": "/path/to/file.js" });
	assert.strictEqual(result.error, false);
});

test("validate files: invalid", () => {
	// @ts-expect-error Testing bad input
	const result = validate.files({ asd: 1 });
	assert.deepStrictEqual(result.value, { asd: 1 });
	assert.strictEqual(result.error ? result.error.length : 0, 3);
});

test("validate files: invalid (empty object)", () => {
	const result = validate.files({});
	assert.deepStrictEqual(result.value, {});
	assert.strictEqual(result.error ? result.error.length : 0, 3);
});

test("validate importMap: valid string", () => {
	const result = validate.importMap("http://myimportmap/file.json");
	assert.deepStrictEqual(result.value, "http://myimportmap/file.json");
	assert.strictEqual(result.error, false);
});

test("validate importMap: valid array", () => {
	const result = validate.importMap([
		"http://myimportmap/file1.json",
		"http://myimportmap/file2.json",
	]);
	assert.deepStrictEqual(result.value, [
		"http://myimportmap/file1.json",
		"http://myimportmap/file2.json",
	]);
	assert.strictEqual(result.error, false);
});

test("validate importMap: invalid string", () => {
	const result = validate.importMap("");
	assert.deepStrictEqual(result.value, "");
	assert.strictEqual(result.error ? result.error.length : 0, 3);
});

test("validate importMap: invalid array", () => {
	const result = validate.importMap([""]);
	assert.deepStrictEqual(result.value, [""]);
	assert.strictEqual(result.error ? result.error.length : 0, 3);
});

test("validate out: valid", () => {
	const result = validate.out("./.eik");
	assert.deepStrictEqual(result.value, "./.eik");
	assert.strictEqual(result.error, false);
});

test("validate out: invalid", () => {
	const result = validate.out("");
	assert.deepStrictEqual(result.value, "");
	assert.strictEqual(result.error ? result.error.length : 0, 1);
});
