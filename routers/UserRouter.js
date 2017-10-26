const UserService = require('../system/UserService');
const LoginService = require('../system/LoginService');

const router = module.exports = exports = express.Router();

/**
 * Creates a new user account
 *
 * @security  AppKeyAuth
 *
 * @body*  {Object}  User object that needs to be created
 *    {
 *      "email": "user@example.com",  | required
 *      "nickname": "JonSmith1337",   |
 *      "password": "passw0rd",       |
 *      "rank": 1,                    |
 *      "studiesCourseId": 42,       <|>
 *      "image": "string"
 *    }
 *
 * @response  {201}  Object successfully created
 * @return  Login
 *    {
 *      "token": "string",
 *      "expires": 0
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/me', AppKeyAuth, _(async function(req, res) {
	const user = req.body;

	if(
		!user          ||
		!user.email    ||
		!user.nickname ||
		!user.password ||
		!user.rank     ||
		!user.studiesCourseId
	) {
		return res.status(405).end('Invalid input');
	}

	const userId = await UserService.createUser(user);
	const login = await LoginService.createLogin(userId);

	res.status(201).json(login);
}));

/**
 * Gets my profile
 * Returns a single user
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  User
 *    {
 *      "id": 0,
 *      "email": "user@example.com",
 *      "nickname": "JonSmith1337",
 *      "image": "string",
 *      "score": 0,
 *      "confirmed": false,
 *      "created": 0,
 *      "rank": 1,
 *      "role": 1
 *    }
 *
 * @response  {404}  Object not found
 */
router.get('/me', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const user = await UserService.getUser(req.currentUser.id);
	if(!user)
		return res.status(404).end('Object not found');

	res.json(user);
}));

/**
 * Updates my profile
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  User object that needs to be updated
 *    {
 *      "nickname": "JonSmith42",
 *      "image": "string"
 *    }
 *
 * @response  {200}  Object successfully updated
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/me', AppKeyAuth, TokenAuth, _(async function(req, res) {
	let changes = 0;
	const update = {};

	if(req.body.nickname) {
		update.nickname = req.body.nickname;
		changes++;
	}

	if('image' in req.body) {
		update.image = req.body.image;
		changes++;
	}

	if(!changes)
		return res.status(405).end('Invalid input');

	const success = await UserService.updateUser(req.currentUser.id, update);
	if(!success)
		return res.status(404).end('Object not found');

	res.end('Object successfully updated');
}));

/**
 * Deletes my user profile
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {204}  Object successfully deleted
 * @response  {404}  Object not found
 */
router.delete('/me', AppKeyAuth, TokenAuth, function(req, res) {
	// deleteUser
});

/**
 * Login with my email and my password
 *
 * @security  AppKeyAuth
 *
 * @body*  {Object}  Login object
 *    {
 *      "email": "user@example.com",  | required
 *      "password": "passw0rd"        |
 *      "deviceId": "string"         <|>
 *    }
 *
 * @response  {200}  Successful operation
 * @return  Token
 *    {
 *      "token": "string",
 *      "expires": 0
 *    }
 *
 * @response  {404}  Object not found
 * @response  {405}  Invalid password
 */
router.post('/me/login', AppKeyAuth, _(async function(req, res) {
	const loginData = req.body;

	if(
		!loginData          ||
		!loginData.email    ||
		!loginData.password ||
		!loginData.deviceId
	) {
		return res.status(405).end('Invalid input');
	}

	const [valid, login] = await LoginService.verifyLoginData(loginData)
	if(!valid) {
		if(login === 404)
			return res.status(404).end('Object not found');
		else
			return res.status(405).end('Invalid password');
	}

	res.status(201).json(login);
}));

/**
 * Reset my password
 * The destination given in the body is the redirect destination after the user
 * clicks the link in the reset email. The reset token would be appended at the
 * end separatet with a slash (`http://example.org/reset` woud be to
 * `http://example.org/reset/{token}`).
 *
 * @security  AppKeyAuth
 *
 * @body*  {Object}  Reset object
 *    {
 *      "email": "user@example.com",  | required
 *      "destination": "string"      <|>
 *    }
 *
 * @response  {200}  Successful operation
 * @response  {404}  Object not found
 */
router.post('/me/reset', AppKeyAuth, function(req, res) {
	// createResetToken
});

/**
 * Confirm a reset request (Link from email)
 * After a user requested a reset this api endpoint are send via email
 *
 * @path*  {string}  token  The confirm token
 *
 * @response  {303}  Redirects to reset page where you can enter your new password
 * @response  {400}  Invalid token supplied
 * @response  {404}  Token not found
 */
router.get('/confirm/:token', function(req, res) {
	// confirmResetToken
});

/**
 * Confirm a reset request
 * Reset a users password
 *
 * @security  AppKeyAuth
 *
 * @path*  {string}  token  The confirm token
 *
 * @body*  {Object}  The new password
 *    {
 *      "password": "passw1rd"  | required
 *    }
 *
 * @response  {200}  Successful operation
 * @response  {400}  Invalid token supplied
 * @response  {404}  Token not found
 * @response  {405}  Invalid input
 */
router.put('/confirm/:token', AppKeyAuth, function(req, res) {
	// resetPassword
});

/**
 * Gets an user by ID
 * Returns a single user
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  userId  ID of user to return
 *
 * @response  {200}  Successful operation
 * @return  User
 *    {
 *      "id": 0,
 *      "email": "user@example.com",
 *      "nickname": "JonSmith1337",
 *      "image": "string",
 *      "score": 0,
 *      "confirmed": false,
 *      "created": 0,
 *      "rank": 1,
 *      "role": 1
 *    }
 *
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 */
router.get('/user/:userId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const userId = parseInt(req.params.userId);

	if(!userId || userId < 1)
		return res.status(400).end('Invalid ID supplied');

	const user = await UserService.getUser(userId);
	if(!user)
		return res.status(404).end('Object not found');

	res.json(user);
}));

/**
 * Get best 10 user for a wall of fame
 * Returns an user array of 10 user
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  User
 *    [
 *      {
 *        "id": 0,
 *        "email": "user@example.com",
 *        "nickname": "JonSmith1337",
 *        "image": "string",
 *        "score": 0,
 *        "confirmed": false,
 *        "created": 0,
 *        "rank": 1,
 *        "role": 1
 *      }
 *    ]
 */
router.get('/user', AppKeyAuth, TokenAuth, function(req, res) {
	// getUsers
});
