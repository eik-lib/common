/**
 * Checks that a value is a valid Eik package type.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid Eik package type
 */
export const type = (value) => {
	if (
		value === "pkg" ||
		value === "map" ||
		value === "npm" ||
		value === "img"
	) {
		return value;
	}
	throw new Error(`Parameter "type" is not valid - Value: ${value}`);
};
