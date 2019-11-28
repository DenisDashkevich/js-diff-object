function _diff(prev, next, path, acc, lastPath) {
	var keys = Object.keys(next);

	var nextValue;
	var prevValue;

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];

		nextValue = next[key];
		prevValue = prev[key];

		if (nextValue === prevValue) {
			continue;
		}

		lastPath = path;
		path = path + key;

		var isObject = typeof nextValue === "object";

		if (!isObject) {
			acc.push({ path: path, next: nextValue, prev: prevValue });
			path = lastPath;
		} else {
			acc.concat(_diff(prevValue, nextValue, path + ".", acc, lastPath));
			path = lastPath;
		}
	}

	return acc;
}

function diff(prev, next) {
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

	return _diff(prev, next, "", [], "");
}

module.exports = diff;
