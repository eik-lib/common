import { isReadableStream } from "../stream.js";

const ReadFile = class ReadFile {
	constructor({ mimeType = "", etag = "" } = {}) {
		this._mimeType = mimeType;
		// @ts-ignore
		this._stream = undefined;
		this._etag = etag;
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

	get [Symbol.toStringTag]() {
		return "ReadFile";
	}
};
export default ReadFile;
