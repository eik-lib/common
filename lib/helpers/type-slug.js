/**
 * Maps between Eik configuration values for the package type and its URL/file system value.
 * Essentially `package` -> `pkg`.
 * @param {string} type
 * @returns {string} the Eik package type
 */
export default (type) => {
	if (type === "package") return "pkg";
	if (type === "image") return "img";
	return type;
};
