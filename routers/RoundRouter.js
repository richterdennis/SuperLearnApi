const RoundService = require('../system/RoundService');

const router = module.exports = exports = express.Router();

/**
 * Gets a random round from a given module ID
 * Returns an array of questions
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  moduleId  ID of module to get questions of
 *
 * @response  {200}  Successful operation
 * @return  Round
 *    {
 *      "id": 1337,
 *      "timestamp": 0,
 *      "questions": [
 *        {
 *          "id": 1337,
 *          "text": "Was bedeutet HTML?",
 *          "image": "string",
 *          "questionType": 2,
 *          "moduleId": 0,
 *          "score": 0,
 *          "voted": "1:upvoted",
 *          "userId": 0,
 *          "created": 0,
 *          "answers": [
 *            {
 *              "id": 1337,
 *              "correct": true,
 *              "text": null
 *            }
 *          ],
 *          "solution": {
 *            "id": 0,
 *            "text": "string",
 *            "image": "string"
 *          }
 *        }
 *      ]
 *    }
 *
 * @response  {400}  Invalid ID supplied
 */
router.get('/round/module/:moduleId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const moduleId = parseInt(req.params.moduleId);

	if(!moduleId || moduleId < 1)
		return res.status(400).end('Invalid ID supplied');

	res.json(await RoundService.getRoundFromModule(moduleId, req.currentUser.id));
}));

/**
 * Gets a random round from a given user ID
 * Returns an array of questions
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  userId  ID of user to get questions of
 *
 * @response  {200}  Successful operation
 * @return  Round
 *    {
 *      "id": 1337,
 *      "timestamp": 0,
 *      "questions": [
 *        {
 *          "id": 1337,
 *          "text": "Was bedeutet HTML?",
 *          "image": "string",
 *          "questionType": 2,
 *          "moduleId": 0,
 *          "score": 0,
 *          "voted": "1:upvoted",
 *          "userId": 0,
 *          "created": 0,
 *          "answers": [
 *            {
 *              "id": 1337,
 *              "correct": true,
 *              "text": null
 *            }
 *          ],
 *          "solution": {
 *            "id": 0,
 *            "text": "string",
 *            "image": "string"
 *          }
 *        }
 *      ]
 *    }
 *
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 */
router.get('/round/user/:userId', AppKeyAuth, TokenAuth, function(req, res) {
	// getRoundFromUser
});

/**
 * Updates an existing round to finish state
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  roundId  ID of round to finish
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 */
router.put('/round/:roundId/finish', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const roundId = parseInt(req.params.roundId);

	if(!roundId || roundId < 1)
		return res.status(400).end('Invalid ID supplied');

	const success = await RoundService.updateRound(roundId, {state: 1});

	if(!success)
		return res.status(404).end('Object not found');

	res.status(200).end('Object successfully updated');
}));
