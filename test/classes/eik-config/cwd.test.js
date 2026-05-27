import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .cwd set to /some/path", () => {
	const config = new EikConfig(validEikConfig, [], "/some/path");
	assert.strictEqual(config.cwd, "/some/path", "should equal the given cwd");
});

test("EikConfig: .cwd set to /some/path/", () => {
	const config = new EikConfig(validEikConfig, [], "/some/path/");
	assert.strictEqual(
		config.cwd,
		"/some/path",
		"should normalize the given cwd",
	);
});

test("EikConfig: .cwd set to invalid relative path some/path", () => {
	try {
		new EikConfig(validEikConfig, [], "some/path");
	} catch (err) {
		assert.ok(
			(err instanceof Error ? err.message : String(err)).includes(
				'"configRootDir" must be an absolute path:',
			),
			"should throw expected error with message",
		);
	}
});
