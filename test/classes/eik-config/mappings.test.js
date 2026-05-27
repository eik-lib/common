import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import FileMapping from "../../../lib/classes/file-mapping.js";
import LocalFileLocation from "../../../lib/classes/local-file-location.js";
import RemoteFileLocation from "../../../lib/classes/remote-file-location.js";
import EikConfig from "../../../lib/classes/eik-config.js";
import { ensurePosix } from "../../../lib/helpers/path-slashes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const validEikConfig = {
	name: "pizza",
	server: "http://server",
	files: { "/": "pizza" },
	version: "0.0.0",
};

const baseDir = join(__dirname, "../../fixtures");

test("mappings - directory given", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "folder",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.ok(mappings[0] instanceof FileMapping);
	assert.ok(mappings[0].source instanceof LocalFileLocation);
	assert.ok(mappings[0].destination instanceof RemoteFileLocation);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(mappings[0].source.basePath.includes("test/fixtures/folder"));
	assert.ok(!mappings[0].source.basePath.includes("client.js"));
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[1].destination.filePathname, "/styles.css");
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/styles.css",
	);
});

test("mappings - directory given - prefixed by ./", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "./folder",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[1].destination.filePathname, "/styles.css");
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/styles.css",
	);
});

test("mappings - directory given - trailing /", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "folder/",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[1].destination.filePathname, "/styles.css");
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/styles.css",
	);
});

test("mappings - directory given - prefixed by ./ (duplicate)", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "./folder",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[1].destination.filePathname, "/styles.css");
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/styles.css",
	);
});

test("mappings - recursive glob given", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "folder/**/*",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[1].destination.filePathname, "/styles.css");
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/styles.css",
	);
});

test("mappings - file given", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "folder/client.js",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 1);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
});

test("mappings - file given via glob", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "folder/*.js",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 1);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/client.js",
	);
});

test("mappings - files given via glob - nested directories", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: "./**/*.js",
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 3);
	assert.strictEqual(
		mappings[0].source.relative,
		"client-with-bare-imports.js",
	);
	assert.strictEqual(mappings[1].source.relative, "client.js");
	assert.strictEqual(mappings[2].source.relative, "folder/client.js");
	assert.strictEqual(
		mappings[0].destination.filePathname,
		"/client-with-bare-imports.js",
	);
	assert.strictEqual(mappings[1].destination.filePathname, "/client.js");
	assert.strictEqual(mappings[2].destination.filePathname, "/folder/client.js");
});

test("mappings - files is an object - remaps name of file", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				"script.js": "folder/client.js",
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 1);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/script.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/script.js",
	);
});

test("mappings - files is an object - remaps name of file - absolute path to file given", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				"script.js": join(baseDir, "folder/client.js").replace(/\\/g, "/"),
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 1);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/script.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/script.js",
	);
});

test("mappings - files is an object - mapped to folder - absolute path to folder given", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				folder: ensurePosix(join(baseDir, "folder")),
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/folder/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(
		mappings[1].destination.filePathname,
		"/folder/styles.css",
	);
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/styles.css",
	);
});

test("mappings - files is an object - mapped to folder - relative path to folder given", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				folder: "./folder",
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/folder/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(
		mappings[1].destination.filePathname,
		"/folder/styles.css",
	);
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/styles.css",
	);
});

test("mappings - files is an object - mapped to folder - relative path to folder given - no leading . in path", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				folder: "folder",
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/folder/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(
		mappings[1].destination.filePathname,
		"/folder/styles.css",
	);
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/styles.css",
	);
});

test("mappings - files is an object - mapped to folder glob", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				folder: "folder/**/*",
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/folder/client.js");
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(
		mappings[1].destination.filePathname,
		"/folder/styles.css",
	);
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/folder/styles.css",
	);
});

test("mappings - files is an object - mapped to folder glob - no folder recursion", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				folder: "*",
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 5);
});

test("mappings - files is an object - mapped to nested folder", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				"path/to/folder": "folder",
			},
		},
		null,
		baseDir,
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings.length, 2);
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(
		mappings[0].destination.filePathname,
		"/path/to/folder/client.js",
	);
	assert.strictEqual(
		mappings[0].destination.url.href,
		"http://server/pkg/pizza/0.0.0/path/to/folder/client.js",
	);
	assert.strictEqual(mappings[1].source.relative, "styles.css");
	assert.ok(
		mappings[1].source.absolute.includes("test/fixtures/folder/styles.css"),
	);
	assert.strictEqual(
		mappings[1].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(
		mappings[1].destination.filePathname,
		"/path/to/folder/styles.css",
	);
	assert.strictEqual(
		mappings[1].destination.url.href,
		"http://server/pkg/pizza/0.0.0/path/to/folder/styles.css",
	);
});

test("mappings - files is an object - mapped to folder - absolute path to folder given - non matching cwd", async () => {
	const config = new EikConfig(
		{
			...validEikConfig,
			files: {
				folder: ensurePosix(join(baseDir, "folder")),
			},
		},
		null,
		process.cwd(),
	);

	const mappings = await config.mappings();
	assert.strictEqual(mappings[0].source.relative, "client.js");
	assert.ok(
		mappings[0].source.absolute.includes("test/fixtures/folder/client.js"),
	);
	assert.strictEqual(
		mappings[0].destination.packagePathname,
		"/pkg/pizza/0.0.0",
	);
	assert.strictEqual(mappings[0].destination.filePathname, "/folder/client.js");
});
