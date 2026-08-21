/**
 * Validates a path extras value, rejecting sequences that could be used
 * to escape the expected package path via encoded characters.
 *
 * Rejects: ".." segments, backslashes (literal or encoded), encoded slashes,
 * and protocol-relative "//" prefixes.
 *
 * @param {string} value
 * @returns {string} the value
 */
export const extra = (value) => {
	if (!value) return value;

	// Fully decode to catch multi-level percent-encoding (%252F → %2F → /).
	// Run twice to handle double-encoding; stable after two passes for all
	// realistic inputs.
	let once;
	let twice;
	try {
		once = decodeURIComponent(value);
		twice = decodeURIComponent(once);
	} catch {
		throw new Error('Parameter "extra" is not valid');
	}

	if (
		twice.includes("..") ||
		twice.includes("\\") ||
		twice.includes("//") ||
		// Reject any remaining encoded slashes or backslashes that survived
		// after decoding (indicates triple+ encoding or other evasion).
		twice.includes("%2F") ||
		twice.includes("%2f") ||
		twice.includes("%5C") ||
		twice.includes("%5c")
	) {
		throw new Error('Parameter "extra" is not valid');
	}

	return value;
};
