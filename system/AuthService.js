const bcrypt = require('bcryptjs');
/**
 * Checks if the given key is a valid app key
 *
 * @param   {string}   key  The app key
 * @return  {Boolean}       isValid?
 */
exports.isValidApp = async function(key) {
	const [err, rows] = await db.query('SELECT valid FROM App WHERE token = ?', [key]);
	if(err) throw err;

	return rows.length && rows[0].valid;
}

/**
 * Generate a hash for the given password
 *
 * @param   {String}  password  The password
 * @return  {String}            The hash
 */
exports.generateHash = async function(password) {
	return await bcrypt.hash(password, 10);
}

/**
 * Compare a password and a hash
 *
 * @param   {String}  password  The password
 * @param   {String}  hash      The hash
 * @return  {boolean}           isCorrect?
 */
exports.compare = async function(password, hash) {
	return await bcrypt.compare(password, hash);
}
