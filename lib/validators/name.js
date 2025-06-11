import npmPkg from "validate-npm-package-name";

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
