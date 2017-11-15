const UserService = require('./UserService');

/**
 * Creates a question
 *
 * @param   {Number}  userId        The creator
 * @param   {Object}  questionData  The question data
 * @return  {Number|false}          The new question id or false on fail
 */
exports.createQuestion = async function(userId, questionData) {
	const tags = await checkTagsArray(questionData.tags);
	if(!tags || !tags.length)
		return false;

	const answers = checkAnswersArray(questionData.questionType, questionData.answers);
	if(!answers)
		return false;

	const solution = checkSolution(questionData.solution);
	if(solution === false)
		return false;

	// insert question
	let data = {
		text:             questionData.text,
		question_type_id: questionData.questionType,
		module_id:        questionData.moduleId,
		user_id:          userId
	};

	if(questionData.image)
		data.image = questionData.image;

	let [err, res] = await db.query('INSERT INTO questions SET ?', data);
	if(err) throw err;

	const questionId = res.insertId;

	// insert tags
	let values = tags.map(tag => [questionId, tag]);

	[err] = await db.query('INSERT INTO questions_question_tags_rel (question_id, question_tag_id) VALUES ?', [values]);
	if(err) throw err;

	// insert answers
	values = answers.map(answer => [answer.correct, answer.text, questionId]);

	[err] = await db.query('INSERT INTO answers (correct, text, question_id) VALUES ?', [values]);
	if(err) throw err;

	// insert solution
	if(!solution) return questionId;

	data = {
		text: solution.text
	};

	if(solution.image)
		data.image = solution.image;

	[err] = await db.query('INSERT INTO solutions SET ?', data);
	if(err) throw err;

	return questionId;
}

/**
 * Updates a question
 *
 * @param   {Number}  userId      The changer
 * @param   {Number}  questionId  The question id
 * @param   {Object}  data        The question data to change
 * @return  {Number}              The status of the success
 */
exports.updateQuestion = async function(userId, questionId, data) {
	let [err, rows] = await db.query('SELECT user_id FROM questions WHERE id = ?', [questionId]);
	if(err) throw err;

	if(rows.length < 1)
		return 404;

	if(rows[0].user_id !== userId) {
		const user = await UserService.getUser(userId);
		if(user.role !== 2)
			return 403;
	}

	[err] = await db.query('UPDATE questions SET ? WHERE id = ?', [data, questionId]);
	if(err) throw err;

	return 200;
}

/**
 * Sets the delete flag of a question
 *
 * @param   {Number}  questionId  The question to delete
 * @return  {boolean}             Success?
 */
exports.deleteQuestion = async function(questionId) {
	const [err, res] = await db.query('UPDATE questions SET deleted = 1 WHERE id = ?', [questionId]);
	if(err) throw err;

	return !!res.changedRows;
}

/**
 * Gets all the questions which creator is the given user
 *
 * @param   {Number}  userId  The question creator
 * @return  {Array}           The question array
 */
exports.getQuestionsByUser = async function(userId) {
	const [err, res] = await db.query('SELECT * FROM questions WHERE user_id = ?', [userId]);
	if(err) throw err;

	const questions = [];
	for(let i = 0; i < res.length; i++) {
		const row = res[i];
		questions.push({
			id: row.id,
			text: row.text,
			image: row.image,
			questionType: row.question_type_id,
			moduleId: row.module_id,
			score: row.score,
			// TODO: voted: await VoteService.getQuestionVoteByUser(userId, row.id),
			userId: row.user_id,
			created: row.created,
			answers: await exports.getAnswers(row.id),
			solution: await exports.getSolution(row.id)
		});
	}

	return questions;
}

/**
 * Gets the answers of a specific question
 *
 * @param   {Number}  questionId  The question id
 * @return  {Array}               The answers
 */
exports.getAnswers = async function(questionId) {
	const [err, res] = await db.query('SELECT id, correct, text FROM answers WHERE question_id = ?', [questionId]);
	if(err) throw err;

	return res;
}

/**
 * Gets the solution of a specific question
 *
 * @param   {Number}  questionId  The question id
 * @return  {Object}              The solution
 */
exports.getSolution = async function(questionId) {
	const [err, res] = await db.query('SELECT id, text, image FROM solutions WHERE question_id = ?', [questionId]);
	if(err) throw err;

	if(!res.length)
		return null;

	return res[0];
}

/**
 * Updates an answer
 *
 * @param   {Number}  userId    The changer id
 * @param   {Number}  answerId  The answer id to change
 * @param   {Object}  data      The change data
 * @return  {Number}            The status of success
 */
exports.updateAnswer = async function(userId, answerId, data) {
	const query = `
		SELECT user_id
		FROM questions q
			JOIN answers a ON q.id = a.question_id
		WHERE a.id = ?
	`;

	let [err, rows] = await db.query(query, [answerId]);
	if(err) throw err;

	if(rows.length < 1)
		return 404;

	if(rows[0].user_id !== userId) {
		const user = await UserService.getUser(userId);
		if(user.role !== 2)
			return 403;
	}

	[err] = await db.query('UPDATE answers SET ? WHERE id = ?', [data, answerId]);
	if(err) throw err;

	return 200;
}

/**
 * Creates a solution
 *
 * @param   {Number}  userId    The creator user id
 * @param   {Object}  solution  The solution to create
 * @return  {Array}             [status, insertId]
 */
exports.createSolution = async function(userId, solution) {
	let [err, res] = await db.query('SELECT user_id FROM questions WHERE id = ?', [solution.questionId]);
	if(err) throw err;

	if(res.length < 1)
		return [404, null];

	if(res[0].user_id !== userId) {
		const user = await UserService.getUser(userId);
		if(user.role !== 2)
			return [403, null];
	}

	const data = {
		text: solution.text,
		question_id: solution.questionId
	};

	if(solution.image)
		data.image = solution.image;

	[err, res] = await db.query('INSERT INTO solutions SET ?', [data]);
	if(err) throw err;

	const solutionId = res.insertId;

	return [200, {
		id: solutionId
	}];
}

/**
 * Updates a solution
 *
 * @param   {Number}  userId      The changer
 * @param   {Number}  solutionId  The solution id
 * @param   {Object}  data        The new solution data
 * @return  {Number}              The status of success
 */
exports.updateSolution = async function(userId, solutionId, data) {
	const query = `
		SELECT user_id
		FROM questions q
			JOIN solutions s ON q.id = s.question_id
		WHERE s.id = ?
	`;

	let [err, rows] = await db.query(query, [solutionId]);
	if(err) throw err;

	if(rows.length < 1)
		return 404;

	if(rows[0].user_id !== userId) {
		const user = await UserService.getUser(userId);
		if(user.role !== 2)
			return 403;
	}

	[err] = await db.query('UPDATE solutions SET ? WHERE id = ?', [data, solutionId]);
	if(err) throw err;

	return 200;
}

/**
 * Private check function used by create question
 * This checks the tags array
 *
 * @param   {Array}  tags  The tags array to check
 * @return  {Array}        Array of existing tags
 */
async function checkTagsArray(tags) {
	if(!(tags instanceof Array))
		return false;

	const [err, rows] = await db.query('SELECT id FROM question_tags WHERE id IN (?)', [tags]);
	if(err) throw err;

	return rows.map(row => row.id);
}

/**
 * Private check function used by create question
 * This checks the answers array
 *
 * @param   {Number}  questionType  The question type (1:boolean, 2:four, 3:exact)
 * @param   {Array}   answers       The answers array to check
 * @return  {Array|false}           The checked answers array or false on fail
 */
function checkAnswersArray(questionType, answers) {
	switch(questionType) {
		case 1:
		case 3:
			answers = [checkAnswer(questionType, answers[0])];
			break;

		case 2:
			if(answers.length !== 4)
				return false;

			answers = answers.map(answer => checkAnswer(questionType, answer));
			break;

		default:
			return false;
	}

	if(answers.some(answer => !answer))
		return false;

	return answers;
}

/**
 * Private check function used by create question
 * This checks a answer
 *
 * @param   {Number}  questionType  The question type
 * @param   {Object}  answer        The answer
 * @return  {Object|false}          The checked answer of false on fail
 */
function checkAnswer(questionType, answer) {
	if(questionType !== 1 && !answer.text)
		return false;

	return {
		correct: !!answer.correct,
		text: questionType === 1 ? null : answer.text
	}
}

/**
 * Private check function used by create question
 * This checks the solution
 *
 * @param   {Object}  solution  The solution to check
 * @return  {Object|false}      The checked solution or false on fail
 */
function checkSolution(solution) {
	if(!solution)
		return null;

	if(!solution.text)
		return false;

	return {
		text: solution.text,
		image: !solution.image ? null : solution.image
	};
}
