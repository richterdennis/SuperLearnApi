const QuestionService = require('../system/QuestionService');

/**
 * Creates a round with questions from a given module
 *
 * @param   {Number}  moduleId  The module id
 * @param   {Number}  userId    The user id
 * @return  {Object}            The round
 */
exports.getRoundFromModule = async function(moduleId, userId) {
	let err, res;

	const roundData = {
		user_id: userId,
		module_id: moduleId
	};

	[err, res] = await db.query('INSERT INTO rounds SET ?', roundData);
	if(err) throw err;

	const roundId = res.insertId;

	[err, res] = await db.query('SELECT * FROM rounds WHERE id = ?', [roundId]);
	if(err) throw err;

	const round = {
		id: res[0].id,
		userId: res[0].user_id,
		moduleId: res[0].module_id,
		timestamp: res[0].timestamp,
		state: res[0].state
	};

	[err, res] = await db.query('SELECT id FROM questions WHERE module_id = ?', [moduleId]);
	if(err) throw err;

	const ids = res.map(row => row.id);

	// TODO: Do magic

	// Simple shuffle of the array
	for(let i = ids.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const t = ids[i];
		ids[i] = ids[j];
		ids[j] = t;
	}

	[err, res] = await db.query('SELECT * FROM questions WHERE id IN (?)', [ids.slice(0, 10)]);
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
			answers: await QuestionService.getAnswers(row.id),
			solution: await QuestionService.getSolution(row.id)
		});
	}

	round.questions = questions;

	return round;
}

/**
 * The updates a round
 *
 * @param   {Number}  roundId  The round id
 * @param   {Object}  data     The data
 * @return  {boolean}          Success?
 */
exports.updateRound = async function(roundId, data) {
	const [err, res] = await db.query('UPDATE rounds SET ? WHERE id = ?', [data, roundId]);
	if(err) throw err;

	return !!res.changedRows;
}
