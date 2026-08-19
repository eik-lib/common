import { isReadableStream } from "../stream.js";

const ReadFile = class ReadFile {
	constructor({ mimeType = "", etag = "", generation = "" } = {}) {
		this._mimeType = mimeType;
		// @ts-ignore
		this._stream = undefined;
		this._etag = etag;
		this._generation = generation;
	}

	get mimeType() {
		return this._mimeType;
	}

	set stream(value) {
		if (!isReadableStream(value))
			throw new Error("Value is not a Readable stream");
		this._stream = value;
	}

	// @ts-ignore
	get stream() {
		return this._stream;
	}

	get etag() {
		return this._etag;
	}

	/**
	 * An opaque version token captured at read time. Pass this back to
	 * sink.write() as options.ifGenerationMatch to perform a compare-and-swap
	 * write that fails if another writer has modified the file in the meantime.
	 */
	get generation() {
		return this._generation;
	}

	get [Symbol.toStringTag]() {
		return "ReadFile";
	}
};
export default ReadFile;
