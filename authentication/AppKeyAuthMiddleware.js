const AuthService = require('../system/AuthService');

/**
 * Authenticates the app
 * Your APP needs to be authorized by an APP-Key
 *
 * @header*  {string}  X-App-Key  The app key
 *
 * @response  {401}  Invalid app key
 */
module.exports = exports = function(req, res, next) {
	const appKey = req.get('X-App-Key');

	if(!appKey) return res.status(401).end('X-App-Key header not found');

	AuthService.isValidApp(appKey).then((isValid) => {
		if(isValid) return next();

		res.status(401).end('Invalid app key');
	});
}
