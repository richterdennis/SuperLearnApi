/**
 * Authenticates the user
 * You needs to be authorized by a Token
 *
 * @header*  {string}  X-User-Token  The user token
 *
 * @response  {401}  Invalid app key
 */
module.exports = exports = function(req, res, next) {
  const token = req.get('X-User-Token');

  console.log('Token:', token);

	next();
}
