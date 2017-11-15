const AuthService = require('../system/AuthService');

/**
 * Authenticates the user
 * You needs to be authorized by a Token
 *
 * @header*  {string}  X-User-Token  The user token
 *
 * @response  {401}  Invalid user token
 */
module.exports = exports = _(async function(req, res, next) {
	const token = req.get('X-User-Token');

	if(!token)
		return res.status(401).end('X-User-Token header not found');

	const [valid, data] = await AuthService.getTokenData(token);

	if(!valid)
		return res.status(401).end('Invalid user token');

	const isExpired = await AuthService.checkTokenExpired(data.userId, token);

	if(isExpired)
		return res.status(401).end('Invalid user token');

	req.currentUser = {
		id: data.userId
	};

	next();
});
