import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import LocalFileLocation from "../../../lib/classes/local-file-location.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("LocalFileLocation: .extension for ./my/file.json", () => {
	const subject = new LocalFileLocation("./my/file.json", __dirname);
	assert.strictEqual(subject.extension, ".json", "should be treated as JSON");
});

test("LocalFileLocation: .extension for ./my/file.js", () => {
	const subject = new LocalFileLocation("./my/file.js", __dirname);
	assert.strictEqual(
		subject.extension,
		".js",
		"should be treated as JavaScript",
	);
});

test("LocalFileLocation: .extension for file.css", () => {
	const subject = new LocalFileLocation("./my/file.css", __dirname);
	assert.strictEqual(subject.extension, ".css", "should be treated as CSS");
});
