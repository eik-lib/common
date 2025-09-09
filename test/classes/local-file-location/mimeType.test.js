import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { test } from "tap";
import LocalFileLocation from "../../../lib/classes/local-file-location.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("LocalFileLocation: .mimeType for ./my/file.json", (t) => {
	const subject = new LocalFileLocation("./my/file.json", __dirname);
	t.equal(subject.mimeType, "application/json", "should be treated as JSON");
	t.end();
});

test("LocalFileLocation: .mimeType for ./my/file.js", (t) => {
	const subject = new LocalFileLocation("./my/file.js", __dirname);
	t.equal(
		subject.mimeType,
		"text/javascript",
		"should be treated as JavaScript",
	);
	t.end();
});

test("LocalFileLocation: .mimeType for file.css", (t) => {
	const subject = new LocalFileLocation("./my/file.css", __dirname);
	t.equal(subject.mimeType, "text/css", "should be treated as CSS");
	t.end();
});

test("LocalFileLocation: .mimeType for file.jpg", (t) => {
	const subject = new LocalFileLocation("./my/file.jpg", __dirname);
	t.equal(subject.mimeType, "image/jpeg", "should be treated as jpeg image");
	t.end();
});

test("LocalFileLocation: .mimeType should fallback for unknown file extension", (t) => {
	const subject = new LocalFileLocation("./my/file.unknown", __dirname);
	t.equal(
		subject.mimeType,
		"application/octet-stream",
		"should be treated as application/octet-stream",
	);
	t.end();
});
