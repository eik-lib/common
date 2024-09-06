import CustomError from "./custom-error.js";

export default class InvalidConfigError extends CustomError {
	/**
	 * @param {string} msg
	 */
	constructor(msg) {
		super(`Eik config object was invalid: '${msg}'`);
	}
}
