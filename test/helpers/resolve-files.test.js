import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { join, basename, dirname } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import resolveFiles from "../../lib/helpers/resolve-files.js";
import { ensurePosix } from "../../lib/helpers/path-slashes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixturesPath = join(__dirname, "../fixtures");

test("when source is a relative folder", async () => {
	const resolved = await resolveFiles({ "/": "./folder" }, fixturesPath);
	assert.strictEqual(
		resolved[0].destination,
		"/",
		"destination should be unchanged",
	);
	assert.strictEqual(
		resolved[0].source,
		"./folder",
		"source should be unchanged",
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*",
		"pattern should exclude basePath",
	);
});

test("when source is a relative folder and files iterator is accessed", async () => {
	const resolved = await resolveFiles({ "/": "folder/**/*" }, fixturesPath);
	for (const file of resolved[0]) {
		assert.strictEqual(
			file.constructor.name,
			"LocalFileLocation",
			`${file.relative} wrapped in LocalFileLocation object`,
		);
	}
	const asArray = [...resolved[0]];
	const { relative, absolute, basePath } = asArray[0];
	assert.strictEqual(
		relative,
		"client.js",
		".relative should not include .basePath",
	);
	assert.strictEqual(
		absolute,
		ensurePosix(join(basePath, relative)),
		".absolute should include .basePath and .relative",
	);
	assert.ok(
		basePath.includes("test/fixtures/folder"),
		".basePath should include everything except .relative",
	);
	assert.ok(
		!basePath.includes("client.js"),
		".basePath should include everything except .relative",
	);
});

test("when source is a relative file", async () => {
	const resolved = await resolveFiles(
		{ "/": "./folder/client.js" },
		fixturesPath,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"client.js",
		"pattern should exclude basePath",
	);
});

test("when source is a relative folder with glob", async () => {
	const resolved = await resolveFiles({ "/": "./folder/**/*" }, fixturesPath);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*",
		"pattern should exclude basePath",
	);
});

test("when source is a relative folder with glob and nested files", async () => {
	const resolved = await resolveFiles({ "/": "./**/*.js" }, fixturesPath);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*.js",
		"pattern should exclude basePath",
	);
	assert.strictEqual([...resolved[0]][2].relative, "folder/client.js");
});

test("when source is an absolute folder", async () => {
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder") },
		fixturesPath,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*",
		"pattern should exclude basePath",
	);
});

test("when source is an absolute file", async () => {
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder/client.js") },
		fixturesPath,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.ok(
		resolved[0].pattern.includes("client.js"),
		"pattern should exclude basePath",
	);
});

test("when source is an absolute folder with glob", async () => {
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder/**/*") },
		fixturesPath,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*",
		"pattern should exclude basePath",
	);
});

test("when source is an absolute folder and cwd is a different directory entirely", async () => {
	const cwd = await fs.mkdtempSync(join(os.tmpdir(), basename(__filename)));
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder") },
		cwd,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*",
		"pattern should exclude basePath",
	);
});

test("when source is an absolute folder and files iterator is accessed", async () => {
	const bPath = await fs.mkdtempSync(join(os.tmpdir(), basename(__filename)));
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder") },
		bPath,
	);
	for (const file of resolved[0]) {
		assert.strictEqual(
			file.constructor.name,
			"LocalFileLocation",
			`${file.relative} wrapped in LocalFileLocation object`,
		);
	}
	const asArray = [...resolved[0]];
	const { relative, absolute, basePath } = asArray[0];
	assert.strictEqual(
		relative,
		"client.js",
		".relative should not include .basePath",
	);
	assert.strictEqual(
		absolute,
		ensurePosix(join(basePath, relative)),
		".absolute should include .basePath and .relative",
	);
	assert.ok(
		basePath.includes("test/fixtures/folder"),
		".basePath should include everything except .relative",
	);
	assert.ok(
		!basePath.includes("client.js"),
		".basePath should include everything except .relative",
	);
});

test("when source is an absolute file and cwd is a different directory entirely", async () => {
	const cwd = fs.mkdtempSync(join(os.tmpdir(), "resolve-files-test-file"));
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder/client.js") },
		cwd,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"client.js",
		"pattern should exclude basePath",
	);
});

test("when source is an absolute folder with glob and cwd is a different directory entirely", async () => {
	const cwd = fs.mkdtempSync(join(os.tmpdir(), "resolve-files-test-glob"));
	const resolved = await resolveFiles(
		{ "/": join(fixturesPath, "folder/**/*") },
		cwd,
	);
	assert.ok(
		resolved[0].basePath.includes("test/fixtures/folder"),
		"basePath should exclude glob",
	);
	assert.strictEqual(
		resolved[0].pattern,
		"**/*",
		"pattern should exclude basePath",
	);
});
