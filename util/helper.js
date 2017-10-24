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
