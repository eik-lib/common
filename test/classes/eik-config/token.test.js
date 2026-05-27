import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .token: no token configured", () => {
	const config = new EikConfig(validEikConfig, null);
	assert.ok(config.token == null);
});

test("EikConfig: .token: single token present: config given", () => {
	const config = new EikConfig(validEikConfig, [["http://server", "muffins"]]);
	assert.strictEqual(
		config.server,
		"http://server",
		"server should be provided from config",
	);
	assert.strictEqual(config.token, "muffins", "token should match given token");
});

test("EikConfig: .token: single token present", () => {
	const config = new EikConfig(null, [["http://server", "muffins"]]);
	assert.strictEqual(
		config.server,
		"http://server",
		"server should be provided from tokens",
	);
	assert.strictEqual(config.token, "muffins", "token should match given token");
});

test("EikConfig: .token: multiple tokens present", () => {
	const config = new EikConfig(null, [
		["http://server", "muffins"],
		["http://server2", "cupcakes"],
	]);
	assert.strictEqual(config.server, "http://server");
	assert.strictEqual(
		config.token,
		"muffins",
		"token should match first given token",
	);
});
