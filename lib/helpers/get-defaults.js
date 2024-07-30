// @ts-check
import configStore from './config-store.js';
import EikConfig from '../classes/eik-config.js';
/**
 * Sets up and returns an object containing a set of default values for the app context.
 * Default values are fetched from the app's eik.json or package.json file as well as from .eikrc, if present in the users home directory.
 *
 * @param {string} cwd The current working directory
 *
 * @returns {import("../classes/eik-config")} EikConfig
 */
export default function getDefaults(cwd) {
    try {
        // @ts-ignore
        return configStore.findInDirectory(cwd);
    } catch (e) {
        // @ts-ignore
        if (e.constructor.name === 'MissingConfigError') {
            // @ts-ignore
            return new EikConfig(null, [], cwd);
        }
        throw e;
    }
};
