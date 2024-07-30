/* eslint-disable no-await-in-loop */

/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
import assert from 'node:assert';
import fs from 'node:fs';
import configStore from './config-store.js';

/**
 * Sets up asset routes for local development. Mounted paths match those on Eik server and values are read from projects eik.json file.
 *
 * @param {object} app - express js or fastify app instance
 * @param {string} rootEikDirectory - (optional) path to folder where eik configuration file can be found
 */
async function localAssets(app, rootEikDirectory = process.cwd()) {
    assert(
        // @ts-ignore
        app.decorateReply || app.name === 'app' || app.route,
        'App must be an Express, Fastify or Hapi app instance',
    );
    assert(
        typeof rootEikDirectory === 'string' && rootEikDirectory,
        'Path to folder for eik config must be provided and must be of type string',
    );
    // ensure eik.json only loaded 1x
    const eik = configStore.findInDirectory(rootEikDirectory);

    (await eik.mappings()).forEach((mapping) => {
        const { pathname } = mapping.destination.url;
        const { contentType, absolute: path } = mapping.source;
        // @ts-ignore
        if (app.get) {
            // @ts-ignore
            app.get(pathname, (req, res) => {
                if (res.set) {
                    // express
                    res.set('Access-Control-Allow-Origin', '*');
                    res.set('content-type', contentType);
                    fs.createReadStream(path).pipe(res);
                } else if (res.type) {
                    // fastify
                    res.header('Access-Control-Allow-Origin', '*');
                    res.type(contentType);
                    res.send(fs.createReadStream(path));
                }
            });
        } else {
            // hapi
            // @ts-ignore
            app.route({
                method: 'GET',
                path: pathname,
                // @ts-ignore
                handler(req, h) {
                    return h
                        .response(fs.createReadStream(path))
                        .header('Access-Control-Allow-Origin', '*')
                        .type(contentType);
                },
            });
        }
    });
}
export default localAssets;
