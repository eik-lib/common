/**
 * Checks if the value is a Stream
 * @param {unknown} stream
 * @returns {boolean}
 */
export const isStream = (stream) =>
	stream !== null &&
	typeof stream === "object" &&
	// @ts-expect-error
	typeof stream.pipe === "function";

/**
 * Checks if the value is a {@link ReadableStream}
 * @param {unknown} stream
 * @returns {boolean}
 */
export const isReadableStream = (stream) =>
	isStream(stream) &&
	// @ts-expect-error
	stream.readable !== false &&
	// @ts-expect-error
	typeof stream._read === "function" &&
	// @ts-expect-error
	typeof stream._readableState === "object";
