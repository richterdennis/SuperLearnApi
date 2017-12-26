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
	query = `UPDATE user SET score = score + ? WHERE id = ?`;
	[err] = await db.query(query, [balanceValue, userId]);
	if(err) throw err;
}
