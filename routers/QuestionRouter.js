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
 *          "id": 1337,               | - four on type 2:four
 *          "correct": true,          |
 *          "text": null              | text only null on type 1:boolean
 *        }                          <|>
 *      ],
 *      "solution": {
 *        "id": 0,
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
router.post('/question', function(req, res) {
	// createQuestion
});

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
 * @response  {403}  Forbitten
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/question/:questionId', function(req, res) {
	// updateQuestion
});

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
 * @response  {403}  Forbitten
 * @response  {404}  Object not found
 */
router.delete('/question/:questionId', function(req, res) {
	// deleteQuestion
});

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
router.get('/questions', function(req, res) {
	// getMyQuestions
});

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
router.get('/questions/random', function(req, res) {
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
router.get('/module/:moduleId/questions/random', function(req, res) {
  // getRandomQuestions
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
 * @response  {403}  Forbitten
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/answer/:answerId', function(req, res) {
	// updateAnswer
});

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
 * @response  {403}  Forbitten
 * @response  {405}  Invalid input
 */
router.post('/solution', function(req, res) {
  // createSolution
});

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
 * @response  {403}  Forbitten
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/solution/:solutionId', function(req, res) {
	// updateSolution
});
