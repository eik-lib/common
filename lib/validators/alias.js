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
