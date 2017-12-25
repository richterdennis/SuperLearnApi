const AuthService = require('../system/AuthService');
const LoginService = require('../system/LoginService');

const router = module.exports = exports = express.Router();

/**
 * Test if a token is valid
 *
 * @security  AppKeyAuth
 *
 * @path*  {string}  token  Token to test
 *
 * @response  {200}  Token is valid
 * @response  {401}  Token is not valid
 */
router.get('/token/test/:token', AppKeyAuth, _(async function(req, res) {
	const token = req.params.token;

	if(!token)
		return req.status(401).end('Token is not valid');

	const [valid, data] = await AuthService.getTokenData(token);

	if(!valid)
		return res.status(401).end('Token is not valid');

	const isExpired = await AuthService.checkTokenExpired(data.userId, token);

	if(isExpired)
		return res.status(401).end('Token is not valid');

	res.end('Token is valid');
}));

/**
 * Update a token before he is expiring
 *
 * @security  AppKeyAuth
 *
 * @path*  {string}  token  Current token
 *
 * @response  {200}  Successful operation
 * @return  Token
 *    {
 *      "token": "string",
 *      "expires": 0
 *    }
 *
 * @response  {401}  Token is not valid
 */
router.get('/token/update/:token', AppKeyAuth, _(async function(req, res) {
	const token = req.params.token;

	if(!token)
		return req.status(401).end('Token is not valid');

	const [valid, data] = await AuthService.getTokenData(token);

	if(!valid)
		return res.status(401).end('Token is not valid');

	const isExpired = await AuthService.checkTokenExpired(data.userId, token);

	if(isExpired)
		return res.status(401).end('Token is not valid');

	res.json(await LoginService.updateLogin(data.userId, token));
}));
