import { test } from "node:test";
import assert from "node:assert/strict";
import LocalFileLocation from "../../../lib/classes/local-file-location.js";

test("LocalFileLocation: .absolute for ./my/file.json", () => {
	const subject = new LocalFileLocation("./my/file.json", "/base/path");
	assert.strictEqual(
		subject.absolute,
		"/base/path/my/file.json",
		"should result in a valid absolute path",
	);
});

test("LocalFileLocation: .absolute for my/file.json", () => {
	const subject = new LocalFileLocation("my/file.json", "/base/path");
	assert.strictEqual(
		subject.absolute,
		"/base/path/my/file.json",
		"should result in a valid absolute path",
	);
});

test("LocalFileLocation: .absolute for my/file.json: base path has trailing slash", () => {
	const subject = new LocalFileLocation("my/file.json", "/base/path/");
	assert.strictEqual(
		subject.absolute,
		"/base/path/my/file.json",
		"should result in a valid absolute path",
	);
});
