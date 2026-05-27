import { Readable } from "stream";
import { test } from "node:test";
import assert from "node:assert/strict";
import ReadFile from "../../lib/classes/read-file.js";

test("ReadFile() - Object type", () => {
	const obj = new ReadFile();
	assert.strictEqual(
		Object.prototype.toString.call(obj),
		"[object ReadFile]",
		"should be ReadFile",
	);
});

test("ReadFile() - Default property values", () => {
	const obj = new ReadFile();
	assert.strictEqual(obj.mimeType, "", ".mimeType should be empty String");
	assert.strictEqual(obj.stream, undefined, '.stream should be "undefined"');
	assert.strictEqual(obj.etag, "", ".etag should be empty String");
});

test('ReadFile() - Set a value on the "mimeType" argument on the constructor', () => {
	const obj = new ReadFile({ mimeType: "foo" });
	assert.strictEqual(
		obj.mimeType,
		"foo",
		".mimeType should be value set on constructor",
	);
});

test('ReadFile() - Set a value on the "etag" argument on the constructor', () => {
	const obj = new ReadFile({ etag: "foo" });
	assert.strictEqual(
		obj.etag,
		"foo",
		".etag should be value set on constructor",
	);
});

test("ReadFile() - Set a Readable stream as value on the .stream property", () => {
	const obj = new ReadFile();
	obj.stream = new Readable();
	assert.ok(
		obj.stream instanceof Readable,
		".stream should be value set on .stream",
	);
});

test("ReadFile() - Set a non Readable stream as value on the .stream property", () => {
	assert.throws(
		() => {
			const obj = new ReadFile();
			obj.stream = "foo";
		},
		/Value is not a Readable stream/,
		"Should throw",
	);
});
