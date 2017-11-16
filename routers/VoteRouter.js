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
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/vote/:value/question/:questionId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const value = parseInt(req.params.value);
	const questionId = parseInt(req.params.questionId);

	if(!questionId) 
		return res.status(400).end('Invalid ID supplied');

	if(value !== 1 && value !==0 && value !==-1)
		return res.status(405).end('Invalid input');

	await VoteService.voteQuestion(questionId, Value);
	res.end('Vote successfully updated');
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
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/vote/:value/user/:userId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const value = parseInt(req.params.value);
	const userId = parseInt(req.params.userId);

	if(!userId) 
		return res.status(404).end('Invalid ID supplied');

	if(value !== 1 && value !==0 && value !==-1)
		return res.status(405).end('Invalid input');

	await VoteService.voteUser(userId,value);
	res.end('Vote successfully updated');
}));
