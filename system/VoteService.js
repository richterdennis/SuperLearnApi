const ScoreService = require('./ScoreService');

/**
 * Update a score for a question
 *
 * @param   {Number}  questionId  The question id
 * @param   {Number}  userId      The user id which is voting
 * @param   {Number}  value       Voting value for question (-1, 0, 1)
 */
exports.voteQuestion = async function(questionId, userId, value){
	let query, data, res, err;

	query = `
		SELECT v.id, v.score
		FROM votings v
			JOIN votings_questions_rel vq
				ON v.id = vq.voting_id
		WHERE
			vq.question_id = ?
			AND v.user_id = ?
	`;

	[err, res] = await db.query(query, [questionId, userId]);
	if(err) throw err;

	let balanceValue = value;

	// Voting exists
	if(res[0]) {
		balanceValue = value - res[0].score;

		query = `UPDATE votings SET score = ? WHERE id = ?`;

		[err] = await db.query(query, [value, res[0].id]);
		if(err) throw err;
	}

	// Voting exists not
	else {
		query = `INSERT INTO votings SET ?`;

		data = {
			user_id: userId,
			score: value
		};

		[err, res] = await db.query(query, [data]);
		if(err) throw err;

		const votingId = res.insertId;

		query = `INSERT INTO votings_questions_rel SET ?`;

		data = {
			voting_id: votingId,
			question_id: questionId
		};

		[err] = await db.query(query, [data]);
		if(err) throw err;
	}

	// Balance question score
	query = `UPDATE questions SET score = score + ? WHERE id = ?`;

	[err] = await db.query(query, [balanceValue, questionId]);
	if(err) throw err;

	// Balance user score which created the question
	balanceValue = 0;

	// on down
	if(value == -1)
		balanceValue -= 25;

	// on up
	else if(value == 1)
		balanceValue += 50;

	// revert on down
	if(res[0] && res[0].score == -1)
		balanceValue += 25;

	// revert on up
	else if(res[0] && res[0].score == 1)
		balanceValue -= 50;

	await ScoreService.updateUserScoreByQuestionId(questionId, balanceValue);

	// Balance user score which voted the question
	balanceValue = 0;

	// on up
	if(value == 1)
		balanceValue += 5;

	// revert on up
	else if(res[0] && res[0].score == 1)
		balanceValue -= 5;

	await ScoreService.updateUserScore(userId, balanceValue);

	// Check on down vote if there is a report
	if(value < 0) {
		query = `
			SELECT
				q.score,
				r.report_type_id
			FROM questions q
				LEFT JOIN reports r
					ON q.id = r.question_id
			WHERE q.id = ?
		`;

		[err, res] = await db.query(query, [questionId]);
		if(err) throw err;

		/*
		 * report types
		 * 1 => offensive
		 * 2 => duplicate
		 * 3 => spelling
		 * 4 => troll
		 * 5 => other
		 */
		if(
			res[0].score > -5 ||
				res[0].reportTypeId != 1 &&
				res[0].reportTypeId != 4
		) return;

		query = 'UPDATE questions SET deleted = 1 WHERE id = ?';

		[err] = await db.query(query, [questionId]);
		if(err) throw err;
	}
}

/**
 * Update a score for an user
 *
 * @param  {Number}  userId   The question id
 * @param  {Number}  voterId  The user id which is voting
 * @param  {Number}  value    Voting value for question (-1, 0, 1)
 */
exports.voteUser = async function(userId, voterId, value){
	let query, data, res, err;

	query = `
		SELECT v.id, v.score
		FROM votings v
			JOIN votings_user_rel vu
				ON v.id = vu.voting_id
		WHERE
			vu.user_id = ?
			AND v.user_id = ?
	`;

	[err, res] = await db.query(query, [userId, voterId]);
	if(err) throw err;

	let balanceValue = value;

	// Voting exists
	if(res[0]) {
		balanceValue = value - res[0].score;

		query = `UPDATE votings SET score = ? WHERE id = ?`;

		[err] = await db.query(query, [value, res[0].id]);
		if(err) throw err;
	}

	// Voting exists not
	else {
		query = `INSERT INTO votings SET ?`;

		data = {
			user_id: voterId,
			score: value
		};

		[err, res] = await db.query(query, [data]);
		if(err) throw err;

		const votingId = res.insertId;

		query = `INSERT INTO votings_user_rel SET ?`;

		data = {
			voting_id: votingId,
			user_id: userId
		};

		[err] = await db.query(query, [data]);
		if(err) throw err;
	}

	// Balance user score
	await ScoreService.updateUserScore(userId, balanceValue);
}

/**
 * Gets the vote from a given user for a given question
 *
 * @param   {Number}  userId      The voter
 * @param   {Number}  questionId  The voted question
 * @return  {Number}              The vote (-1, 0, 1)
 */
exports.getQuestionVoteByUser = async function(userId, questionId) {
	const query = `
		SELECT v.score
		FROM votings v
			JOIN votings_questions_rel vq
				ON v.id = vq.voting_id
		WHERE
			vq.question_id = ?
			AND v.user_id = ?
	`;

	const [err, res] = await db.query(query, [questionId, userId]);
	if(err) throw err;

	return res[0] && res[0].score || 0;
}
