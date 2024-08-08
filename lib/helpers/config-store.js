import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import os from 'node:os';
import EikConfig from '../classes/eik-config.js';
import MissingConfigError from '../classes/missing-config-error.js';
import MultipleConfigSourcesError from '../classes/multiple-config-sources-error.js';
import InvalidConfigError from '../classes/invalid-config-error.js';

const homedir = os.homedir();

/**
 * Read a file at a given path and parse it
 *
 * @param {string} path
 *
 * @returns {object}
 */
function readJSONFromDisk(path) {
    let fileData;
    try {
        fileData = readFileSync(path, { encoding: 'utf8' });
        // eslint-disable-next-line no-unused-vars
    } catch (e) {
        // @ts-ignore
        return null;
    }
    return JSON.parse(fileData);
}

export default {
    /**
     * Load the configuration from an exact path and return an EikConfig object
     *
     * @param {string} configFilePathname
     * @param {function} loadJSONFromDisk
     *
     * @returns {EikConfig}
     */
    loadFromPath(configFilePathname, loadJSONFromDisk = readJSONFromDisk) {
        const eikJSON = loadJSONFromDisk(configFilePathname);
        if (!eikJSON) {
            throw new MissingConfigError(dirname(configFilePathname));
        }
        let assets = eikJSON;
        // detect package.json
        if (eikJSON.eik) {
            assets = {
                name: eikJSON.name,
                version: eikJSON.version,
                ...eikJSON.eik,
            };
        }
        const eikrc = loadJSONFromDisk(join(homedir, '.eikrc')) || {};
        return new EikConfig(assets, eikrc.tokens, dirname(configFilePathname));
    },
    /**
     * Tries to find the configuration for eik in the provided directory.
     *
     * @param {string} configRootDir The base directory for the eik project.
     * @param {function} [loadJSONFromDisk] The function to use to load the file from disk.
     *
     * @returns {EikConfig}
     */
    findInDirectory(configRootDir, loadJSONFromDisk = readJSONFromDisk) {
        const pkgJSON = loadJSONFromDisk(join(configRootDir, 'package.json'));
        const eikJSON = loadJSONFromDisk(join(configRootDir, 'eik.json'));
        if (
            pkgJSON != null &&
            Object.prototype.hasOwnProperty.call(pkgJSON, 'eik') &&
            eikJSON != null
        ) {
            throw new MultipleConfigSourcesError();
        }
        let assets;
        if (pkgJSON) {
            const { name, version, eik } = pkgJSON;
            if (eik) {
                assets = { name, version, ...pkgJSON.eik };
            }
        }
        if (eikJSON) {
            assets = { ...assets, ...eikJSON };
        }
        if (assets == null) {
            throw new MissingConfigError(configRootDir);
        }
        const eikrc = loadJSONFromDisk(join(homedir, '.eikrc')) || {};
        const config = new EikConfig(assets, eikrc.tokens, configRootDir);
        try {
            config.validate();
        } catch (err) {
            throw new InvalidConfigError(
                // @ts-ignore
                `config.findInDirectory operation failed: ${err.message}`,
            );
        }
        return config;
    },

    /**
     * Persist config changes to disk as <cwd>/eik.json
     *
     * @param {import('../classes/eik-config.js')} config
     */
    persistToDisk(config) {
        try {
            // @ts-ignore
            config.validate();
        } catch (err) {
            throw new InvalidConfigError(
                // @ts-ignore
                `config.persistToDisk operation failed: ${err.message}`,
            );
        }
        // @ts-ignore
        const dest = join(config.cwd, 'eik.json');
        writeFileSync(dest, JSON.stringify(config, null, 2));
    },
};
