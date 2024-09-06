import { sep } from "path";
import { platform } from "os";

/**
 * Add a trailing slash to a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
export const addTrailingSlash = (val) => (val.endsWith("/") ? val : `${val}/`);

/**
 * Remove a trailing slash from a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
export const removeTrailingSlash = (val) =>
	// this is also used to trim from config files, which may now always use the OS's sep value. Look for both.
	val.endsWith("/") || val.endsWith("\\") ? val.substr(0, val.length - 1) : val;

/**
 * Add a leading slash to a path if necessary, but not on Windows
 *
 * @param {string} val
 *
 * @returns {string}
 */
export const addLeadingSlash = (val) =>
	val.startsWith("/") || platform() === "win32" ? val : `/${val}`;

/**
 * Remove a leading slash from a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
export const removeLeadingSlash = (val) =>
	val.startsWith("/") || val.startsWith("\\") ? val.substr(1) : val;

/**
 * Replaces a path string's separators (/ or \) with the current OS's sep value from node:path.
 * @param {string} val
 * @returns {string}
 */
export const ensureOsSep = (val) => val.replace(/\/\\/g, sep);

/**
 * Replaces any backslash with a forward slash.
 * @param {string} val
 * @returns {string}
 */
export const ensurePosix = (val) => val.replace(/\\/g, "/");
