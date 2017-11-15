const QuestionService = require('../system/QuestionService');
const UserService = require('../system/UserService');

const router = module.exports = exports = express.Router();

/**
 * Creates a new question
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  Question object that needs to be created
 *    {
 *      "text": "Was bedeutet CSS?",  | required
 *      "image": "string",
 *      "questionType": 3,            | required
 *      "moduleId": 0,                |
 *      "tags": [                     |
 *        0                          <|>
 *      ],
 *      "answers": [                  | required
 *        {                           | - one on type 1:boolean and 3:exact
 *          "correct": true,          | - four on type 2:four
 *          "text": null              | text only null on type 1:boolean
 *        }                          <|>
 *      ],
 *      "solution": {
 *        "text": "string",
 *        "image": "string"
 *      }
 *    }
 *
 * @response  {201}  Object successfully created
 * @return  CreateResponse
 *    {
 *      "id": 1337
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/question', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const question = req.body;

	if(
		!question              ||
		!question.text         ||
		!question.questionType ||
		!question.moduleId     ||

		!question.tags         ||
		!question.tags.length  ||

		!question.answers      ||
		!question.answers.length
	)
		return res.status(405).end('Invalid input');

	const userId = req.currentUser.id;

	const questionId = await QuestionService.createQuestion(userId, question);
	if(!questionId)
		return res.status(405).end('Invalid input');

	res.status(201).json({
		id: questionId
	});
}));

/**
 * Updates an existing question
 * This can only be done if this is your question or you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  questionId  ID of question to update
 *
 * @body*  {Object}  Question object
 *    {
 *      "text": "Was bedeutet HTML?",
 *      "image": "string"
 *    }
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/question/:questionId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const questionId = parseInt(req.params.questionId);

	if(!questionId || questionId < 1)
		return res.status(400).end('Invalid ID supplied');

	let changes = 0;
	const update = {};

	if(req.body.text) {
		update.text = req.body.text;
		changes++;
	}

	if('image' in req.body) {
		update.image = req.body.image;
		changes++;
	}

	if(!changes)
		return res.status(405).end('Invalid input');

	const userId = req.currentUser.id;

	const status = await QuestionService.updateQuestion(userId, questionId, update);

	switch(status) {
		case 200: res.end('Object successfully updated');  break;
		case 403: res.status(403).end('Forbidden');        break;
		case 404: res.status(404).end('Object not found'); break;
		default:
			res.sendStatus(status);
	}
}));

/**
 * Deletes an existing question but not for the creator
 * This can only be done, if you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  questionId  ID of question to delete
 *
 * @response  {204}  Object successfully deleted
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 */
router.delete('/question/:questionId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const questionId = parseInt(req.params.questionId);

	if(!questionId || questionId < 1)
		return res.status(400).end('Invalid ID supplied');

	const currentUser = await UserService.getUser(req.currentUser.id);
	if(!currentUser)
		return res.status(404).end('User not found');

	if(currentUser.role !== 2)
		return res.status(403).end('Forbidden');

	const success = await QuestionService.deleteQuestion(questionId);
	if(!success)
		return res.status(404).end('Object not found');

	res.status(204).end('Object successfully deleted');
}));

/**
 * Get all my questions
 * Returns an question array of all my questions
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  Questions
 *    [
 *      {
 *        "id": 1337,
 *        "text": "Was bedeutet HTML?",
 *        "image": "string",
 *        "questionType": 2,
 *        "moduleId": 0,
 *        "score": 0,
 *        "voted": "1:upvoted",
 *        "userId": 0,
 *        "created": 0,
 *        "answers": [
 *          {
 *            "id": 1337,
 *            "correct": true,
 *            "text": null
 *          }
 *        ],
 *        "solution": {
 *          "id": 0,
 *          "text": "string",
 *          "image": "string"
 *        }
 *      }
 *    ]
 */
router.get('/questions', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const userId = req.currentUser.id;

	res.json(await QuestionService.getQuestionsByUser(userId));
}));

/**
 * Get a bunch of random questions
 * Returns an question array of random questions
 *
 * @security  AppKeyAuth
 *
 * @query  {integer}  size  Size of bunch (Must be between 1 and 20; Default is 10)
 *
 * @response  {200}  Successful operation
 * @return  Questions
 *    [
 *      {
 *        "id": 1337,
 *        "text": "Was bedeutet HTML?",
 *        "image": "string",
 *        "questionType": 2,
 *        "moduleId": 0,
 *        "score": 0,
 *        "voted": "1:upvoted",
 *        "userId": 0,
 *        "created": 0,
 *        "answers": [
 *          {
 *            "id": 1337,
 *            "correct": true,
 *            "text": null
 *          }
 *        ],
 *        "solution": {
 *          "id": 0,
 *          "text": "string",
 *          "image": "string"
 *        }
 *      }
 *    ]
 */
router.get('/questions/random', AppKeyAuth, function(req, res) {
	// getRandomQuestions
});

/**
 * Get a bunch of random questions from a specific module
 * Returns an question array of random questions
 *
 * @security  AppKeyAuth
 *
 * @path*  {integer}  moduleId  ID of module to get the questions from
 *
 * @query  {integer}  size  Size of bunch (Must be between 1 and 20; Default is 10)
 *
 * @response  {200}  Successful operation
 * @return  Questions
 *    [
 *      {
 *        "id": 1337,
 *        "text": "Was bedeutet HTML?",
 *        "image": "string",
 *        "questionType": 2,
 *        "moduleId": 0,
 *        "score": 0,
 *        "voted": "1:upvoted",
 *        "userId": 0,
 *        "created": 0,
 *        "answers": [
 *          {
 *            "id": 1337,
 *            "correct": true,
 *            "text": null
 *          }
 *        ],
 *        "solution": {
 *          "id": 0,
 *          "text": "string",
 *          "image": "string"
 *        }
 *      }
 *    ]
 */
router.get('/module/:moduleId/questions/random', AppKeyAuth, function(req, res) {
  // getRandomQuestions
  res.status(200).end();
});

/**
 * Updates an existing answer
 * This can only be done if this is a answer of your question or you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  answerId  ID of answer to update
 *
 * @body*  {Object}  Answer object
 *    {
 *      "correct": true,
 *      "text": "string"
 *    }
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/answer/:answerId', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const answerId = parseInt(req.params.answerId);

	if(!answerId || answerId < 1)
		return res.status(400).end('Invalid ID supplied');

	let changes = 0;
	const update = {};

	if('correct' in req.body) {
		update.correct = req.body.correct;
		changes++;
	}

	if(req.body.text) {
		update.text = req.body.text;
		changes++;
	}

	if(!changes)
		return res.status(405).end('Invalid input');

	const userId = req.currentUser.id;

	const status = await QuestionService.updateAnswer(userId, answerId, update);

	switch(status) {
		case 200: res.end('Object successfully updated');  break;
		case 403: res.status(403).end('Forbidden');        break;
		case 404: res.status(404).end('Object not found'); break;
		default:
			res.sendStatus(status);
	}
}));

/**
 * Creates a solution
 * This can only be done if this is a solution of your question or you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  answerId  ID of solution to update
 *
 * @body*  {Object}  Solution object
 *    {
 *      "text": "string",
 *      "image": "string",
 *      "questionId": 1337
 *    }
 *
 * @response  {200}  Object successfully updated
 * @return  CreateResponse
 *    {
 *      "id": 1337
 *    }
 *
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.post('/solution', AppKeyAuth, TokenAuth, _(async function(req, res) {
  const solution = req.body;

  if(
  	!solution ||
  	!solution.questionId ||
  	!solution.text
  )
  	return res.status(405).end('Invalid input');

  if(solution.questionId < 1)
  	return res.status(400).end('Invalid ID supplied');

  const userId = req.currentUser.id;

  const [status, cRes] = await QuestionService.createSolution(userId, solution);

  switch(status) {
		case 200: res.json(cRes);                          break;
		case 403: res.status(403).end('Forbidden');        break;
		case 404: res.status(404).end('Object not found'); break;
		default:
			res.sendStatus(status);
	}
}));

/**
 * Updates an existing solution
 * This can only be done if this is a solution of your question or you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  answerId  ID of solution to update
 *
 * @body*  {Object}  Solution object
 *    {
 *      "text": "string",
 *      "image": "string"
 *    }
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/solution/:solutionId', AppKeyAuth, TokenAuth, function(req, res) {
	// updateSolution
});
