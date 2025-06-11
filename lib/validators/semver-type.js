/**
 * Checks that a value is a valid semver type (major, minor, patch).
 * @param {string} value
 * @returns {string} the value
 * @throws {Error} if the value is not a valid semver type
 */
export const semverType = (value) => {
	if (value === "major" || value === "minor" || value === "patch") {
		return value;
	}
	throw new Error(`Parameter "semverType" is not valid - Value: ${value}`);
};
