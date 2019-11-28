function _diff(prev, next, path, lastPath, acc) {
	var keys = Object.keys(next);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];

		var nextValue = next[key];
		var prevValue = prev[key];

		if (nextValue === prevValue) {
			continue;
		}

		lastPath = path;
		path = path + key;

		var isObject = typeof nextValue === "object";

		isObject
			? acc.concat(_diff(prevValue, nextValue, path + ".", lastPath, acc))
			: acc.push({ path: path, next: nextValue, prev: prevValue })

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

	return _diff(prev, next, "", "", []);
}

module.exports = diff;
