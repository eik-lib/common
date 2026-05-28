import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .toJSON", () => {
	const config = new EikConfig(validEikConfig);
	assert.deepStrictEqual(
		config.toJSON(),
		validEikConfig,
		"should serialize config given to constructor",
	);
});
