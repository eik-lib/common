import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .version: accessing the property", () => {
	const config = new EikConfig(validEikConfig);
	assert.strictEqual(config.version, "0.0.0", "should return the given value");
});

test("EikConfig: .version: setting the property value", () => {
	const config = new EikConfig(validEikConfig);
	config.version = "1.0.1";
	assert.strictEqual(config.version, "1.0.1", "should return the given value");
});
