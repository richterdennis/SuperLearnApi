/**
 * Update a score for a question
 *
 * @param   {Object}  voting     The voting data      
 * @param   {Number}  value      voting value for question 
 * @param   {Number}  qestionId  The question id
 *
 * @return  {boolean}             success?
 */
exports.voteQuestion = async function(voting, qestionId, value){
	let data = {
		id:    voting.id,
		user_id: voting.user_id,
		score:  value
	};

	let queryNewVoting = 'INSERT INTO votings SET ? ON DUPLICATE KEY UPDATE ?'

	let queryVotingQuestionRel = `
	INSERT INTO votings_questions_rel VALUES(?,?) 
	ON DUPLICATE KEY 
	UPDATE votings_questions_rel.question_id = ?`

	let queryUpdateQuestionScore = `
	UPDATE questions q 
	JOIN votings_questions_rel vq
	ON q.id = vq.question_id  
	JOIN votings v
	ON v.id = vq.voting_id 
	SET q.score = q.score + ? 
	WHERE q.id = ?`

	let [err, res] = await db.query(queryNewVoting, [data,data]);
	if(err) throw err;

	[err, res] = await db.query(queryVotingQuestionRel, [data.id, qestionId, qestionId]);
	if(err) throw err;

	[err, res] = await db.query(queryUpdateQuestionScore, [data.score, qestionId]);
	if(err) throw err;

	return !!res.changedRows;
}

/**
 * Update a score for an user
 *
 * @param   {Object}  voting     The voting data 
 * @param   {Number}  value      voting value for user 
 * @param   {Number}  qestionId  The user id
 *
 * @return  {boolean}             success?
 */
exports.voteUser = async function(voting, userId, value){
	let data = {
		id:    voting.id,
		user_id: voting.user_id,
		score:  value
	};

	let queryInsertVoting = `INSERT INTO votings SET ? ON DUPLICATE KEY UPDATE ?`

	let queryVotingUserRel = `
	INSERT INTO votings_user_rel VALUES(?,?) 
	ON DUPLICATE KEY 
	UPDATE votings_user_rel.user_id = ?`

	let queryTwo = `
	UPDATE user u  
	JOIN votings_user_rel uq
	ON u.id = uq.user_id  
	JOIN votings v
	ON v.id = uq.voting_id 
	SET u.score = u.score + ? 
	WHERE u.id = ?`

	let [err, res] = await db.query(queryInsertVoting, [data, data]);
	if(err) throw err;

	[err, res] = await db.query(queryVotingUserRel, [data.id, userId, userId]);
	if(err) throw err;

	[err, res] = await db.query(queryTwo, [data.score, userId]);
	if(err) throw err;

	return !!res.changedRows;
}