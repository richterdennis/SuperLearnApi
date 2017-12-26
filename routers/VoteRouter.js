const VoteService = require('../system/VoteService');

const router = module.exports = exports = express.Router();

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
 * @response  {405}  Invalid input
 */
router.put('/vote/:value/question/:questionId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const value = parseInt(req.params.value);
	const questionId = parseInt(req.params.questionId);

	if(value !== 1 && value !== 0 && value !== -1)
		return res.status(405).end('Invalid input');

	if(!questionId)
		return res.status(400).end('Invalid ID supplied');

	await VoteService.voteQuestion(questionId, req.currentUser.id, value);

	res.end('Object successfully updated');
}));

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
 * @response  {405}  Invalid input
 */
router.put('/vote/:value/user/:userId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const value = parseInt(req.params.value);
	const userId = parseInt(req.params.userId);

	if(value !== 1 && value !== 0 && value !== -1)
		return res.status(405).end('Invalid input');

	if(!userId)
		return res.status(400).end('Invalid ID supplied');

	await VoteService.voteQuestion(userId, req.currentUser.id, value);

	res.end('Object successfully updated');
}));
