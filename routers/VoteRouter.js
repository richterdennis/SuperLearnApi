const express = require('express');
const router = express.Router();

/**
 * Updates an existing vote or create one
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  value       Value of the voting (must be 1, 0 or -1)
 * @path*  {integer}  questionId  ID of question to vote
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/vote/:value/question/:questionId', function(req, res) {
	// voteQuestion
});

/**
 * Updates an existing vote or create one
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  value   Value of the voting (must be 1, 0 or -1)
 * @path*  {integer}  userId  ID of user to vote
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/vote/:value/user/:userId', function(req, res) {
	// voteUser
});

module.exports = router;
