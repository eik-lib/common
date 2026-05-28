import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .map: set to string http://map", () => {
	const config = new EikConfig({
		...validEikConfig,
		"import-map": "http://map",
	});
	assert.deepStrictEqual(
		config.map,
		["http://map"],
		"should be wrapped into an array",
	);
});

test("EikConfig: .map: set to an array with two values", () => {
	const config = new EikConfig({
		...validEikConfig,
		"import-map": ["http://map", "http://map"],
	});
	assert.deepStrictEqual(
		config.map,
		["http://map", "http://map"],
		"should remain the same as input",
	);
});
