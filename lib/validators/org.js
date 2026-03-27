const orgRe = /^[a-zA-Z0-9_-]+$/;

/**
 * Checks that a value is a valid organisation name.
 * @param {string} value
 * @returns {string} the value in lowercase
 * @throws {Error} if the value is not a valid organisation name
 */
export const org = (value) => {
	if (orgRe.test(value)) {
		return value.toLowerCase();
	}
	throw new Error(`Parameter "org" is not valid - Value: ${value}`);
};
