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

	const query = `
		SELECT id FROM questions
		WHERE
			module_id = ?
			AND (
				user_id = ?
				OR
				deleted = 0 AND (
					score > -3
					OR
					created >= DATE_SUB(NOW(), INTERVAL 1 DAY)
				)
			)
	`;

	[err, res] = await db.query(query, [moduleId]);
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

	round.questions = await Promise.all(
		res.map(row => QuestionService.completeQuestionByRes(userId, row))
	);

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
