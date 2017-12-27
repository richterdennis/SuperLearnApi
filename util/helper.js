/**
 * Converts a callback function to an async one
 *
 * @param   {Object}    context  The context which fn is called from
 * @param   {Function}  fn       The callback function
 * @return  {Function}           The async function
 */
exports.toAsync = function(context, fn) {
	return function() {
		const args = [...arguments];
		return new Promise((resolve) => {
			args.push(function() {
				resolve([...arguments]);
			});
			fn.apply(context, args);
		});
	};
}

/**
 * Converts an async function to a non async one
 * This is experimental and maybe deleted later
 *
 * @param   {Function}  fn  The async function
 * @return  {Function}      The sync function
 */
exports.fromAsync = function(fn) {
	return function() {
		fn(...arguments).catch(console.error);
	}
}

/**
 * Wrapps express async functions to use as a none async one
 *
 * @param   {Function}  fn  The async function
 * @return  {Function}      The sync function
 */
exports.expressAsyncWrapper = function(fn) {
	return function(req, res, next) {
		fn(req, res, next).catch(next);
	}
}

/**
 * Simple shuffle of an array
 *
 * @param   {Array}  array  The array to shuffle
 * @return  {Array}         The shuffled array
 */
exports.shuffle = function(array) {
	for(let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const t = array[i];
		array[i] = array[j];
		array[j] = t;
	}
	return array;
}
