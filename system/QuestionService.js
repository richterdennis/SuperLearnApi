const UserService = require('./UserService');

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

exports.updateQuestion = async function(userId, questionId, data) {
	let [err, rows] = await db.query('SELECT user_id FROM questions WHERE id = ?', [userId]);
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

async function checkTagsArray(tags) {
	if(!(tags instanceof Array))
		return false;

	const [err, rows] = await db.query('SELECT id FROM question_tags WHERE id IN (?)', [tags]);
	if(err) throw err;

	return rows.map(row => row.id);
}

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

function checkAnswer(questionType, answer) {
	if(questionType !== 1 && !answer.text)
		return false;

	return {
		correct: !!answer.correct,
		text: questionType === 1 ? null : answer.text
	}
}

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
