import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
	type: "npm",
};

test("EikConfig: .type: no value given", () => {
	const config = new EikConfig(null);
	assert.strictEqual(config.type, "package", 'should default to "package"');
});

test("EikConfig: .type: value given", () => {
	// @ts-ignore
	const config = new EikConfig(validEikConfig);
	assert.strictEqual(config.type, "npm", "should overwrite default value");
});
