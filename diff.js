function _diff(prev, next, path, acc) {
	var keys = Object.keys(next);

	var nextValue;
	var prevValue;
	var lastPath;

	for (var i = 0; i < keys.length; i++) {
		lastPath = path;
		var key = keys[i];

		nextValue = next[key];
		prevValue = prev[key];

		if (nextValue === prevValue) {
			continue;
		}

		path = path + key;

		if (typeof nextValue === "object") {
			acc.concat(_diff(prevValue, nextValue, path + ".", acc));

			path = lastPath;
			continue;
		}

		acc.push({ path: path, next: nextValue, prev: prevValue });
		path = "";
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

	return _diff(prev, next, "", []);
}

// const prev = { a: 12, b: { s: { w: { q: 'pabswq', l: [1,2,3,4] } } }, l: () => {}, q: { d: [{ a: 12, b: () => {} }, { b: { s: { w: { q: 'pabswq', l: [1,2,3,4] } } } }] } };
// const next = { a: 12, b: { s: { w: { q: 'pabswq', l: [1,2,3,4] } } }, l: () => {}, q: { d: [{ a: 12, b: () => {} }, { b: { s: { w: { q: 'pabswq', l: [1,2,3,2] } } } }] } };

// console.log(JSON.stringify(diff(prev, next)));

module.exports = diff;
