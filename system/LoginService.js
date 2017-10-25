const AuthService = require('./AuthService');

/**
 * This creates a login for the given user id
 *
 * @param   {Number}  userId  The user id
 * @return  {Object}          The login
 */
exports.createLogin = async function(userId) {
	const tokenData = {
		userId: userId,
		exp: (Date.now() / 1000 | 0) + config.TOKEN_LIVE_TIME
	}

	const token = await AuthService.generateToken(tokenData);

	const data = {
		user_id: userId,
		device_id: 'unknown',
		token: token,
		expires: new Date(tokenData.exp + 1000)
	}

	const [err, res] = await db.query('INSERT INTO logins SET ?', data);
	if(err) throw err;

	return {
		token: token,
		expires: tokenData.exp
	};
}
