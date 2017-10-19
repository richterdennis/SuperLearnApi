const express = require('express');
const router = express.Router();

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
router.get('/token/test/:token', function(req, res) {
	// testToken
});

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
router.get('/token/update/:token', function(req, res) {
	// updateToken
});

module.exports = router;
