import fastify from "fastify";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { fetchImportMaps } from "../../lib/helpers/fetch-import-maps.js";

const app = fastify({
	keepAliveTimeout: 20,
	forceCloseConnections: true,
});

app.get("/map/lit/v3", (request, reply) => {
	/** @type {import("../../lib/helpers/fetch-import-maps.js").ImportMap} */
	const map = {
		imports: {
			lit: "https://assets.example.com/npm/lit/v3/lit.min.js",
		},
	};
	reply.send(map);
});

app.get("/map/react/v19", (request, reply) => {
	/** @type {import("../../lib/helpers/fetch-import-maps.js").ImportMap} */
	const map = {
		imports: {
			react: "https://assets.example.com/npm/react/v19/react.min.js",
			"react-dom":
				"https://assets.example.com/npm/react-dom/v19/react-dom.min.js",
		},
	};
	reply.send(map);
});

app.get("/map/rejected-response/v1", (request, reply) => {
	reply.status(403).send();
});

app.get("/map/server-error/v1", (request, reply) => {
	reply.status(500).send();
});

app.get("/map/empty-response/v1", (request, reply) => {
	reply.send("");
});

app.get("/map/text-response/v1", (request, reply) => {
	reply.send("<h1>Hello, World</h1>");
});

/** @type {string} */
let address;

before(async () => {
	address = await app.listen({
		host: "0.0.0.0",
		port: 50255,
	});
});

after(() => app.close());

test("returns the expected maps", async () => {
	const result = await fetchImportMaps([
		`${address}/map/lit/v3`,
		`${address}/map/react/v19`,
	]);
	assert.deepStrictEqual(result, [
		{
			imports: {
				lit: "https://assets.example.com/npm/lit/v3/lit.min.js",
			},
		},
		{
			imports: {
				react: "https://assets.example.com/npm/react/v19/react.min.js",
				"react-dom":
					"https://assets.example.com/npm/react-dom/v19/react-dom.min.js",
			},
		},
	]);
});

test("returns an error if an import map could not be found", async () => {
	await assert.rejects(
		fetchImportMaps([`${address}/map/does-not-exist/v1`]),
		/could not be found/,
	);
});

test("returns an error if server says no", async () => {
	await assert.rejects(
		fetchImportMaps([`${address}/map/rejected-response/v1`]),
		/rejected client request/,
	);
});

test("returns an error if server is down", async () => {
	await assert.rejects(
		fetchImportMaps([`${address}/map/server-error/v1`]),
		/Server error/,
	);
});

test("returns an error if an import map fetch returns an empty result", async () => {
	await assert.rejects(
		fetchImportMaps([`${address}/map/empty-response/v1`]),
		/got an empty response/,
	);
});

test("returns an error if an import map fetch returns non-JSON content", async () => {
	await assert.rejects(
		fetchImportMaps([`${address}/map/text-response/v1`]),
		/did not return JSON, got/,
	);
});
