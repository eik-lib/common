import valid from "semver/functions/valid.js";

/**
 * Checks that a value is a valid semver version.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid semver version
 */
export const version = (value) => {
	const result = valid(value);
	if (result) {
		return result;
	}
	throw new Error(`Parameter "version" is not valid - Value: ${value}`);
};
