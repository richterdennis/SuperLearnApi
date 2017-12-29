const helper = require('../util/helper');

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
		SELECT
			q.id,
			IFNULL(uq.star_counter, 0) as star_counter,
			q.created
		FROM questions q
			LEFT JOIN user_questions_rel uq
				ON q.id = uq.question_id AND uq.user_id = ?
		WHERE
			q.module_id = ?
			AND (
				uq.star_counter < 3
				OR
				uq.star_counter IS NULL
			)
			AND (
				q.user_id = ?
				OR
				q.deleted = 0 AND (
					q.score > -3
					OR
					q.created >= DATE_SUB(NOW(), INTERVAL 1 DAY)
				)
			)
	`;

	[err, res] = await db.query(query, [userId, moduleId, userId]);
	if(err) throw err;

	// Simple shuffle of the array
	res = helper.shuffle(res);

	const ids = [];

	// Find 1 question which is new
	for(let i = 0; i < res.length && ids.length < 1; i++) {
		if(res[i].created >= Date.now() - 1000*60*60*24*7)
			ids.push(res[i].id);
	}

	ids.forEach(id => {
		const i = res.findIndex(q => q.id == id);
		if(i > -1) res.splice(i, 1);
	});

	// Find 1 question with 2 times correct
	for(let i = 0; i < res.length && ids.length < 2; i++) {
		if(res[i].star_counter == 2)
			ids.push(res[i].id);
	}

	ids.forEach(id => {
		const i = res.findIndex(q => q.id == id);
		if(i > -1) res.splice(i, 1);
	});

	// Find 2 question with 1 times correct
	for(let i = 0; i < res.length && ids.length < 4; i++) {
		if(res[i].star_counter == 1)
			ids.push(res[i].id);
	}

	ids.forEach(id => {
		const i = res.findIndex(q => q.id == id);
		if(i > -1) res.splice(i, 1);
	});

	// Fill with random questions
	for(let i = 0; i < res.length && ids.length < 10; i++) {
		ids.push(res[i].id);
	}

	[err, res] = await db.query('SELECT * FROM questions WHERE id IN (?)', [ids.slice(0, 10)]);
	if(err) throw err;

	// Simple shuffle of the array
	res = helper.shuffle(res);

	round.questions = await Promise.all(
		res.map(row => QuestionService.completeQuestionByRes(userId, row))
	);

	return round;
}

/**
 * This finishes a round
 *
 * @param   {Number}  roundId  The round id
 */
exports.finishRound = async function(roundId, userId) {
	let query, err, res;
/*
	query = `
		SELECT timestamp
		FROM rounds
		WHERE
			user_id = ?
			AND
			state = 1
			AND
			timestamp >= DATE_SUB(NOW(), INTERVAL 1 WEEK
	`;

	[err, res] = await db.query(query, [userId]);
	if(err) throw err;

	// TODO: Check first round of the day and 7 day streak */

	query = `UPDATE rounds SET ? WHERE id = ?`;

	[err] = await db.query(query, [{state: 1}, roundId]);
	if(err) throw err;
}
