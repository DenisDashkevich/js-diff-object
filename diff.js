function equals (prevValue, nextValue) {
	return prevValue === nextValue;
}

function transform (diffChunk) {
	return diffChunk;
}

function isObject (source) {
	return typeof source === 'object';
}

function isFunction (source) {
	return typeof source === 'function';
}

function isArray (source) {
	return Object.prototype.toString.call(source) === '[object Array]';
}

function traverse (source, cb) {
	for (key in source) {
		if (!source.hasOwnProperty(key)) {
			continue;
		}

		cb(key);
	}
}

function count (source) {
	if (isArray(source)) {
		return source.length;
	}

	var acc = 0;

	traverse(source, function () { acc += 1; });

	return acc;
}

function _diff(prev, next, options, path, lastPath, acc) {
	// Double <count> was made to respect missing fields, btw it is hugely increse complexity. :(
	// TODO: it would be nice, to reduce this both source traversal to pick up source to observe.
	traverse(count(prev) > count(next) ? prev : next, function (key) {
		var nextValue = next[key];
		var prevValue = prev[key];

		if (options.equals(prevValue, nextValue)) {
			return;
		}

		lastPath = path;
		path = path + key;

		isObject(nextValue) && isObject(prevValue)
			? acc.concat(_diff(prevValue, nextValue, options, path + ".", lastPath, acc))
			: acc.push(options.transform({ path: path, next: nextValue, prev: prevValue }));

		path = lastPath;
	});

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

	if (!isObject(prev) && !isObject(next)) {
		throw new Error("Both sources are invalid.");
	}

	if (!isObject(prev) || !isObject(next)) {
		throw new Error("One of the provided sources is invalid.");
	}

	if ((isArray(prev) && !isArray(next)) || (!isArray(prev) && isArray(next))) {
		throw new Error('Both sources should be the same type.');
	}

	if (!options || !isObject(options) || isArray(options)) {
		options = {};
	}

	if (!options.equals || !isFunction(options.equals)) {
		options.equals = equals;
	}

	if (!options.transform || !isFunction(options.equals)) {
		options.transform = transform;
	}

	return _diff(prev, next, options, "", "", []);
}

module.exports = diff;
