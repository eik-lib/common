import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import express from "express";
import fastify from "fastify";
import { test } from "node:test";
import assert from "node:assert/strict";
import stoppable from "stoppable";
import localAssets from "../../lib/helpers/local-assets.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Server {
	constructor() {
		this.app = express();
	}

	start() {
		return new Promise((resolve, reject) => {
			try {
				this.server = this.app.listen(0, () => {
					this.port = this.server.address().port;
					// @ts-ignore
					resolve();
				});
				stoppable(this.server);
			} catch (err) {
				reject(err);
			}
		});
	}

	stop() {
		return new Promise((resolve, reject) => {
			try {
				this.server.stop(resolve);
			} catch (err) {
				reject(err);
			}
		});
	}
}

test("Setup development routes for express", async () => {
	const server = new Server();
	await localAssets(server.app, __dirname);
	await server.start();

	const res1 = await fetch(
		new URL("/pkg/my-app/1.0.0/esm.js", `http://localhost:${server.port}`),
	);
	const res2 = await fetch(
		new URL("/pkg/my-app/1.0.0/esm.css", `http://localhost:${server.port}`),
	);
	const res3 = await fetch(
		new URL(
			"/pkg/my-app/1.0.0/assets/esm.css.map",
			`http://localhost:${server.port}`,
		),
	);
	const res4 = await fetch(
		new URL(
			"/pkg/my-app/1.0.0/assets/esm.js.map",
			`http://localhost:${server.port}`,
		),
	);

	assert.strictEqual(res1.status, 200);
	assert.strictEqual(res2.status, 200);
	assert.strictEqual(res3.status, 200);
	assert.strictEqual(res4.status, 200);
	await server.stop();
});

test("Setup development routes for fastify", async () => {
	const server = fastify();
	await localAssets(server, __dirname);
	const address = await server.listen();

	const res1 = await fetch(new URL("/pkg/my-app/1.0.0/esm.js", address));
	const res2 = await fetch(new URL("/pkg/my-app/1.0.0/esm.css", address));
	const res3 = await fetch(
		new URL("/pkg/my-app/1.0.0/assets/esm.css.map", address),
	);
	const res4 = await fetch(
		new URL("/pkg/my-app/1.0.0/assets/esm.js.map", address),
	);

	assert.strictEqual(res1.status, 200);
	assert.strictEqual(res2.status, 200);
	assert.strictEqual(res3.status, 200);
	assert.strictEqual(res4.status, 200);
	await server.close();
});

test("Invalid app instance", async () => {
	await assert.rejects(localAssets({}, __dirname));
});

test("Invalid eik.json string", async () => {
	const server = fastify();
	await assert.rejects(localAssets(server, ""));
});
