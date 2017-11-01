exports.createQuestion = async function(questionData) {
	const tags = await checkTagsArray(questionData.tags);
	if(!tags || !tags.length)
		return false;

	const answers = checkAnswersArray(questionData.questionType, questionData.answers);
	if(!answers)
		return false;

	const solution = checkSolution(questionData.solution);
	if(solution === false)
		return false;


}

async function checkTagsArray(tags) {
	if(!(tags instanceof Array))
		return false;

	const [err, rows] = await db.query('SELECT id FROM tags WHERE id IN ?', [tags]);
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
