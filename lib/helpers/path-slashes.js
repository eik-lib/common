const { sep } = require('path');
const { platform } = require('os');

/**
 * Add a trailing slash to a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const addTrailingSlash = (val) => (val.endsWith('/') ? val : `${val}/`);

/**
 * Remove a trailing slash from a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const removeTrailingSlash = (val) =>
    // this is also used to trim from config files, which may now always use the OS's sep value. Look for both.
    val.endsWith('/') || val.endsWith('\\')
        ? val.substr(0, val.length - 1)
        : val;

/**
 * Add a leading slash to a path if necessary, but not on Windows
 *
 * @param {string} val
 *
 * @returns {string}
 */
const addLeadingSlash = (val) =>
    val.startsWith('/') || platform() === 'win32' ? val : `/${val}`;

/**
 * Remove a leading slash from a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const removeLeadingSlash = (val) =>
    val.startsWith('/') || val.startsWith('\\') ? val.substr(1) : val;

/**
 * Replaces a path string's separators (/ or \) with the current OS's sep value from node:path.
 * @param {string} val
 * @returns {string}
 */
const ensureOsSep = (val) => val.replace(/\/\\/g, sep);

export {
    ensureOsSep,
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
};
