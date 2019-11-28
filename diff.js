function equal (prevValue, nextValue) {
	return prevValue === nextValue;
}

function transform (diffChunk) {
	return diffChunk;
}

function _diff(prev, next, options, path, lastPath, acc) {
	for (key in next) {
		if (!next.hasOwnProperty(key)) {
			continue;
		}

		var nextValue = next[key];
		var prevValue = prev[key];

		if (options.equal(prevValue, nextValue)) {
			continue;
		}

		lastPath = path;
		path = path + key;

		typeof nextValue === "object"
			? acc.concat(_diff(prevValue, nextValue, options, path + ".", lastPath, acc))
			: acc.push(options.transform({ path: path, next: nextValue, prev: prevValue }));

		path = lastPath;
	}

	return acc;
}

/**
 * Diff two object sources and give output as array of changes
 * @param {Object} prev - prev source
 * @param {Object} next - next source
 * @param {Object} options - options
 * @returns {Array<Object>}
 */
function diff(prev, next, options) {
	if (!prev && !next) {
		throw new Error("No sources found. Please provided both sources.");
	}

	if (!prev || !next) {
		throw new Error("One of the provided sources is not provided.");
	}

	var prevType = typeof prev;
	var nextType = typeof next;

	if (prevType !== "object" && nextType !== "object") {
		throw new Error("Both sources are invalid.");
	}

	if (prevType !== "object" || nextType !== "object") {
		throw new Error("One of the provided sources is invalid.");
	}

	if (!options || typeof options !== 'object' || Object.prototype.toString.call(options) === '[object Array]') {
		options = {};
	}

	if (!options.equal || typeof options.equal !== 'function') {
		options.equal = equal;
	}

	if (!options.transform || typeof options.transform !== 'function') {
		options.transform = transform;
	}

	return _diff(prev, next, options, "", "", []);
}

module.exports = diff;
