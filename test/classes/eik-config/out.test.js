import { test } from "node:test";
import assert from "node:assert/strict";
import EikConfig from "../../../lib/classes/eik-config.js";

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

test("EikConfig: .out: no value given", () => {
	assert.strictEqual(
		new EikConfig(validEikConfig).out,
		".eik",
		"should default to .eik",
	);
});

test("EikConfig: .out: value pizza-box given", () => {
	assert.strictEqual(
		new EikConfig({
			...validEikConfig,
			out: "pizza-box",
		}).out,
		"pizza-box",
		"should be set to ./pizza-box",
	);
});

test("EikConfig: .out: value pizza-box/ given", () => {
	assert.strictEqual(
		new EikConfig({
			...validEikConfig,
			out: "pizza-box/",
		}).out,
		"pizza-box",
		"should have trailing slash removed",
	);
});

test("EikConfig: .out: value ./pizza-box given", () => {
	assert.strictEqual(
		new EikConfig({
			...validEikConfig,
			out: "./pizza-box",
		}).out,
		"pizza-box",
		"should have leading ./ slash removed",
	);
});
