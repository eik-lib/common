/**
 * @typedef {object} ImportMap
 * @property {Record<string, string>} imports
 */

/**
 * @param {string[]} urls
 * @returns {Promise<ImportMap[]>}
 */
export async function fetchImportMaps(urls = []) {
	try {
		const maps = urls.map(async (map) => {
			const response = await fetch(map);

			if (response.status === 404) {
				throw new Error("Import map could not be found on server");
			} else if (response.status >= 400 && response.status < 500) {
				throw new Error("Server rejected client request");
			} else if (response.status >= 500) {
				throw new Error("Server error");
			}

			let contentType = response.headers.get("content-type");
			if (!contentType.startsWith("application/json")) {
				const content = await response.text();
				if (content.length === 0) {
					throw new Error(
						`${map} did not return JSON, got an empty response. HTTP status: ${response.status}`,
					);
				}
				throw new Error(
					`${map} did not return JSON, got: ${content}. HTTP status: ${response.status}`,
				);
			}

			const json = await response.json();
			return /** @type {ImportMap}*/ (json);
		});
		return await Promise.all(maps);
	} catch (err) {
		throw new Error(
			`Unable to load import map file from server: ${err.message}`,
		);
	}
}
