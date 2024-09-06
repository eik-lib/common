import fs from "node:fs";
import path from "node:path";
import configStore from "./config-store.js";
import EikConfig from "../classes/eik-config.js";
/**
 * Sets up and returns an object containing a set of default values for the app context.
 * Default values are fetched from the app's eik.json or package.json file as well as from .eikrc, if present in the users home directory.
 *
 * @param {string} directoryOrFilepath The directory to search for eik.json or package.json or an exact path to an eik.json or package.json file
 *
 * @returns {import("../classes/eik-config.js").default} EikConfig
 */
export default function getDefaults(directoryOrFilepath) {
	try {
		const stats = fs.statSync(directoryOrFilepath);
		if (stats.isDirectory()) {
			return configStore.findInDirectory(directoryOrFilepath);
		} else {
			return configStore.loadFromPath(directoryOrFilepath);
		}
	} catch (error) {
		const e = /** @type {Error} */ (error);
		if (e.constructor.name === "MissingConfigError") {
			// assume directory
			let cwd = directoryOrFilepath;
			// detect exact file and get its directory
			if (path.extname(directoryOrFilepath)) {
				cwd = path.dirname(directoryOrFilepath);
			}
			return new EikConfig(null, [], cwd);
		}
		throw e;
	}
}
