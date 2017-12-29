const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
jwt.sign = helper.toAsync(jwt, jwt.sign);
jwt.verify = helper.toAsync(jwt, jwt.verify);

/**
 * Checks if the given key is a valid app key
 *
 * @param   {string}   key  The app key
 * @return  {Boolean}       isValid?
 */
exports.isValidApp = async function(key) {
	const [err, rows] = await db.query('SELECT valid FROM app WHERE token = ?', [key]);
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

/**
 * Generate a JWT token
 *
 * @param   {Object}  payload  The payload date stored in the token
 * @return  {String}           The token
 */
exports.generateToken = async function(payload) {
	payload.exp = payload.exp || (Date.now() / 1000 | 0) + config.TOKEN_LIVE_TIME;

	const [err, token] = await jwt.sign(payload, config.TOKEN_SIGN_KEY);
	if(err) throw err;

	return token;
}

/**
 * Gets the data stored in the token
 *
 * @param   {String}  token  The token
 * @return  {Array}          [isValid?, data]
 */
exports.getTokenData = async function(token) {
	const [err, data] = await jwt.verify(token, config.TOKEN_SIGN_KEY);
	return [!err, data];
}

/**
 * Check if a token is expired and stored in the db
 *
 * @param   {Number}  userId  The user id
 * @param   {String}  token   The token
 * @return  {boolean}         isExpired?
 */
exports.checkTokenExpired = async function(userId, token) {
	const query = 'SELECT expires FROM logins WHERE user_id = ? AND token = ?';
	const [err, rows] = await db.query(query, [userId, token]);
	if(err) throw err;

	return (
		!rows.length                       ||
		!(rows[0].expires instanceof Date) ||
		rows[0].expires < Date.now()
	);
}
