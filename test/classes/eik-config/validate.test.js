import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .validate(): no config given", () => {
	try {
		const config = new EikConfig(null);
		config.validate();
	} catch (err) {
		assert.ok(
			(err instanceof Error ? err.message : String(err)).includes(
				"Invalid eik.json schema",
			),
			"should throw for invalid config",
		);
	}
});

test("EikConfig: .validate(): no config given", () => {
	const config = new EikConfig(validEikConfig);
	config.validate();
	assert.ok(true, "should not throw when valid config is given");
});
