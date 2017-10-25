const AuthService = require('./AuthService');

/**
 * This creates a login for the given user id
 *
 * @param   {Number}  userId    The user id
 * @param   {Number}  deviceid  The device id
 * @return  {Object}            The login
 */
exports.createLogin = async function(userId, deviceId = null) {
	const tokenData = {
		userId: userId,
		exp: (Date.now() / 1000 | 0) + config.TOKEN_LIVE_TIME
	}

	const token = await AuthService.generateToken(tokenData);

	const data = {
		user_id: userId,
		device_id: deviceId || 'unknown',
		token: token,
		expires: new Date(tokenData.exp * 1000)
	}

	const [err, res] = await db.query('INSERT INTO logins SET ?', data);
	if(err) throw err;

	return {
		token: token,
		expires: tokenData.exp
	};
}

exports.verifyLoginData = async function(loginData) {
		!loginData.email    ||
		!loginData.password ||
		!loginData.deviceId

	const query = 'SELECT id, password FROM user WHERE email = ? AND banned = 0';
	const [err, res] = await db.query(query, [loginData.email]);
	if(err) throw err;

	if(!res.length)
		return [false, 404];

	if(!await AuthService.compare(loginData.password, res[0].password))
		return [false, 405];

	const login = await exports.createLogin(res[0].id, loginData.deviceId);
	return [true, login];
}
