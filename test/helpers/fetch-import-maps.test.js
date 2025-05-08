import fastify from "fastify";
import tap from "tap";
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

tap.before(async () => {
	address = await app.listen({
		host: "0.0.0.0",
		port: 50255,
	});
});

tap.teardown(() => app.close());

tap.test("returns the expected maps", async (t) => {
	const result = await fetchImportMaps([
		`${address}/map/lit/v3`,
		`${address}/map/react/v19`,
	]);
	t.match(result, [
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
	t.end();
});

tap.test("returns an error if an import map could not be found", async (t) => {
	try {
		await fetchImportMaps([`${address}/map/does-not-exist/v1`]);
		t.fail("Expected to throw");
	} catch (e) {
		t.match(e.message, "could not be found");
		t.pass();
	}
});

tap.test("returns an error if server says no", async (t) => {
	try {
		await fetchImportMaps([`${address}/map/rejected-response/v1`]);
		t.fail("Expected to throw");
	} catch (e) {
		t.match(e.message, "rejected client request");
		t.pass();
	}
});

tap.test("returns an error if server is down", async (t) => {
	try {
		await fetchImportMaps([`${address}/map/server-error/v1`]);
		t.fail("Expected to throw");
	} catch (e) {
		t.match(e.message, "Server error");
		t.pass();
	}
});

tap.test(
	"returns an error if an import map fetch returns an empty result",
	async (t) => {
		try {
			await fetchImportMaps([`${address}/map/empty-response/v1`]);
			t.fail("Expected to throw");
		} catch (e) {
			t.match(e.message, "got an empty response");
			t.pass();
		}
	},
);

tap.test(
	"returns an error if an import map fetch returns non-JSON content",
	async (t) => {
		try {
			await fetchImportMaps([`${address}/map/text-response/v1`]);
			t.fail("Expected to throw");
		} catch (e) {
			t.match(e.message, "did not return JSON, got");
			t.pass();
		}
	},
);
