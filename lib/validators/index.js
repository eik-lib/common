import semver from 'semver';
import npmPkg from 'validate-npm-package-name';

const urlIsh = /^https?:\/\/[a-zA-Z0-9-_./]+(:[0-9]+)?/;

/**
 * Check that a value looks like an HTTP origin.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the parameter does not match a URL pattern
 */
export const origin = (value) => {
    if (urlIsh.test(value)) {
        return value.toLowerCase();
    }
    throw new Error('Parameter "origin" is not valid');
};

/**
 * Checks that a value is a valid organisation name.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid organisation name
 */
export const org = (value) => {
    if (/^[a-zA-Z0-9_-]+$/.test(value)) {
        return value.toLowerCase();
    }
    throw new Error(`Parameter "org" is not valid - Value: ${value}`);
};

/**
 * Checks that a value is a valid package name.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid package name
 */
export const name = (value) => {
    const result = npmPkg(value);
    if (result.validForNewPackages || result.validForOldPackages) {
        return value.toLowerCase();
    }
    throw new Error(`Parameter "name" is not valid - Value: ${value}`);
};

/**
 * Checks that a value is a valid semver version.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid semver version
 */
export const version = (value) => {
    const result = semver.valid(value);
    if (result) {
        return result;
    }
    throw new Error(`Parameter "version" is not valid - Value: ${value}`);
};

/**
 * Checks that a value is a valid alias value.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid alias value
 */
export const alias = (value) => {
    if (/^[0-9]+$/.test(value)) {
        return value;
    }
    throw new Error(`Parameter "alias" is not valid - Value: ${value}`);
};

/**
 * Checks that a value is a valid Eik package type.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid Eik package type
 */
export const type = (value) => {
    if (value === 'pkg' || value === 'map' || value === 'npm') {
        return value;
    }
    throw new Error(`Parameter "type" is not valid - Value: ${value}`);
};

/**
 * No-op, returning its value.
 * @param {string} value
 * @returns {string} the value
 * @todo https://github.com/asset-pipe/core/issues/12
 * @todo Can we remove this?
 */
export const extra = (value) => value;

/**
 * Checks that a value is a valid semver type (major, minor, patch).
 * @param {string} value
 * @returns {string} the value
 * @throws {Error} if the value is not a valid semver type
 */
export const semverType = (value) => {
    if (value === 'major' || value === 'minor' || value === 'patch') {
        return value;
    }
    throw new Error(`Parameter "semverType" is not valid - Value: ${value}`);
};
