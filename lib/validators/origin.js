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
