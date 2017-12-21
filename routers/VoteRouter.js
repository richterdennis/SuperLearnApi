const VoteService = require('../system/VoteService');

const router = module.exports = exports = express.Router();

/**
 * Updates an existing vote or create one
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  voting object that needs to be created
 *    {
 *		"id": 0,  	   | required
 *      "user_id": 0,  | 
 *      "score": 1,   <|>
 *    }
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

	const votings = req.body;

	if(!questionId) 
		return res.status(400).end('Invalid ID supplied');

	if(value !== 1 && value !==0 && value !==-1)
		return res.status(405).end('Invalid input');

	if(	!votings			||	
		!votings.id			||	
		!votings.user_id	||	
		!votings.score)
	{
		return res.status(405).end('Invalid input');
	}
	
	const erg = await VoteService.voteQuestion(votings, questionId, value,{ 
		processed: true });

	if(!erg)
		return res.status(404).end('Object not found');
	

	res.end('Vote successfully updated');
}));

/**
 * Updates an existing vote or create one
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  voting object that needs to be created
 *    {
 *		"id": 0,  	   | required
 *      "user_id": 0,  | 
 *      "score": 1,   <|>
 *    }
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

	const votings = req.body;

	if(!userId) 
		return res.status(404).end('Invalid ID supplied');

	if(value !== 1 && value !==0 && value !==-1)
		return res.status(405).end('Invalid input');

	if(	!votings			||	
		!votings.id			||	
		!votings.user_id	||	
		!votings.score)
	{
		return res.status(405).end('Invalid input');
	}

	const erg = await VoteService.voteUser(votings, userId, value,{ 
		processed: true });

	if(!erg)
		return res.status(404).end('Object not found');

	res.end('Vote successfully updated');
}));
