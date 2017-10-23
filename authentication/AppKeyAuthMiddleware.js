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

	console.log('AppKey:', appKey);
	console.log('Hostname:', req.hostname);
	console.log('Ip:', req.ip);
	console.log('Ips:', req.ips);

	next();
}
