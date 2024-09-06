/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
import assert from "node:assert";
import LocalFileLocation from "./local-file-location.js";
import {
	removeLeadingSlash,
	removeTrailingSlash,
} from "../helpers/path-slashes.js";

const originalFiles = Symbol("files");

class ResolvedFiles {
	/**
	 * @param {string[]} files
	 * @param {{definition: [string, string], basePath: string, pattern: string}} meta
	 */
	constructor(files, meta) {
		assert(Array.isArray(files), '"files" must be an array');
		assert(meta, '"meta" must be defined');
		assert(typeof meta.basePath, '"meta.basePath" must be a non empty string');
		assert(typeof meta.pattern, '"meta.pattern" must be a non empty string');
		assert(
			Array.isArray(meta.definition),
			'"meta.definition" must be an array',
		);
		assert(
			meta.definition.length === 2,
			'"meta.definition" must be an array of length 2',
		);

		const [destination, source] = meta.definition;
		this[originalFiles] = files;
		this.destination = destination;
		this.source = source;
		this.basePath = meta.basePath;
		this.pattern = meta.pattern;
	}

	*[Symbol.iterator]() {
		for (const file of this[originalFiles]) {
			const relative = removeTrailingSlash(
				removeLeadingSlash(file.replace(/\\/g, "/").replace(this.basePath, "")),
			);
			yield new LocalFileLocation(relative, this.basePath);
		}
	}
}

export default ResolvedFiles;
