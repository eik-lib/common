import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import LocalFileLocation from "../../../lib/classes/local-file-location.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("LocalFileLocation: .contentType for ./my/file.json", () => {
	const subject = new LocalFileLocation("./my/file.json", __dirname);
	assert.strictEqual(
		subject.contentType,
		"application/json; charset=utf-8",
		"should be treated as JSON",
	);
});

test("LocalFileLocation: .contentType for ./my/file.js", () => {
	const subject = new LocalFileLocation("./my/file.js", __dirname);
	assert.strictEqual(
		subject.contentType,
		"text/javascript; charset=utf-8",
		"should be treated as JavaScript",
	);
});

test("LocalFileLocation: .contentType for file.css", () => {
	const subject = new LocalFileLocation("./my/file.css", __dirname);
	assert.strictEqual(
		subject.contentType,
		"text/css; charset=utf-8",
		"should be treated as CSS",
	);
});

test("LocalFileLocation: .contentType for file.jpg", () => {
	const subject = new LocalFileLocation("./my/file.jpg", __dirname);
	assert.strictEqual(
		subject.contentType,
		"image/jpeg",
		"should be treated as jpeg image",
	);
});

test("LocalFileLocation: .contentType should fallback for unknown file extension", () => {
	const subject = new LocalFileLocation("./my/file.unknown", __dirname);
	assert.strictEqual(
		subject.contentType,
		"application/octet-stream",
		"should be treated as application/octet-stream",
	);
});
