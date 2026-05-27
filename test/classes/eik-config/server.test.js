import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .server: accessing property", () => {
	const config = new EikConfig(validEikConfig);
	assert.strictEqual(
		config.server,
		"http://server",
		"should equal value given to constructor",
	);
});

test("EikConfig: .server: accessing property: no config given", () => {
	const config = new EikConfig(null, [
		["http://bakery", "muffins"],
		["http://server", "kumara pie"],
	]);
	assert.strictEqual(
		config.server,
		"http://bakery",
		"should fallback to value given to tokens",
	);
});
