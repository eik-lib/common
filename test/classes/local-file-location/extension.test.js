import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { test } from "tap";
import LocalFileLocation from "../../../lib/classes/local-file-location.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("LocalFileLocation: .extension for ./my/file.json", (t) => {
	const subject = new LocalFileLocation("./my/file.json", __dirname);
	t.equal(subject.extension, ".json", "should be treated as JSON");
	t.end();
});

test("LocalFileLocation: .extension for ./my/file.js", (t) => {
	const subject = new LocalFileLocation("./my/file.js", __dirname);
	t.equal(subject.extension, ".js", "should be treated as JavaScript");
	t.end();
});

test("LocalFileLocation: .extension for file.css", (t) => {
	const subject = new LocalFileLocation("./my/file.css", __dirname);
	t.equal(subject.extension, ".css", "should be treated as CSS");
	t.end();
});
