import { test } from "node:test";
import assert from "node:assert/strict";
import ResolvedFiles from "../../../lib/classes/resolved-files.js";

test("ResolvedFiles: iterator for ./my/file.js", () => {
	// @ts-ignore
	const subject = new ResolvedFiles(["./my/file.js", "./my/file.css"], {
		basePath: "/base/path",
		definition: ["dest", "src"],
	});

	const files = [...subject];
	assert.strictEqual(
		files[0].relative,
		"./my/file.js",
		"should result in a valid absolute path",
	);
});
