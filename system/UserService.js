const AuthService = require('./AuthService');

/**
 * Creates a user
 *
 * @param   {Object}  user  The user
 * @return  {Number}        The user id
 */
exports.createUser = async function(user) {
	let query, err, res;

	// Check email is THM mail
	if(!user.email.endsWith('@iem.thm.de'))
		return "EMAIL_NOT_THM";

	// Check email and nickname already known in the db
	query = `SELECT email, nickname FROM user WHERE email = ? OR nickname = ?`;
	[err, res] = await db.query(query, [user.email, user.nickname]);
	if(err) throw err;

	if(res.length) {
		if(res[0].email == user.email)
			return "EMAIL_EXISTS";

		if(res[0].nickname == user.nickname)
			return "NICKNAME_EXISTS";

		return -1;
	}

	let data = {
		email:    user.email,
		nickname: user.nickname
	};

	if(user.image)
		data.image = user.image;

	data.password = await AuthService.generateHash(user.password);

	[err, res] = await db.query('INSERT INTO user SET ?', data);
	if(err) throw err;

	const userId = res.insertId;

	data = {
		user_id: userId,
		studies_course_id: user.studiesCourseId
	};

	[err, res] = await db.query('INSERT INTO user_studies_courses_rel SET ?', data);
	if(err) throw err;

	return userId;
}

/**
 * Gets a user with the given user id
 *
 * @param   {Number}  userId  The user id
 * @return  {Object}          The user
 */
exports.getUser = async function(userId) {
	const [err, res] = await db.query('SELECT id, email, nickname, image, score, confirmed, created, rank_id as rank FROM user WHERE id = ?', userId);
	if(err) throw err;

	if(!res.length)
		return null;

	const user = res[0];

	user.created = user.created.getTime() / 1000 | 0;

	/**
	 * Rank
	 *
	 * 1 -> student
	 * 2 -> admin
	 * 3 -> prof
	 * 4 -> lecturer
	 *
	 *
	 * Role
	 *
	 * 1 -> User,
	 * 2 -> Manager
	 */
	user.role = user.rank > 1 || user.score > 9999 ? 2 : 1;

	return user;
}

/**
 * Updates a user
 *
 * @param   {Number}  userId  The user id
 * @param   {Object}  update  The update data
 * @return  {boolean}         Success?
 */
exports.updateUser = async function(userId, update) {
	const [err, res] = await db.query('UPDATE user SET ? WHERE id = ?', [update, userId]);
	if(err) throw err;

	return !!res.changedRows;
}

/**
 * Gets the best 10 user by score
 *
 * @return  {Array}  The user
 */
exports.getBest10User = async function() {
	const [err, res] = await db.query('SELECT id, email, nickname, image, score, confirmed, created, rank_id as rank FROM user ORDER BY score DESC LIMIT 10');
	if(err) throw err;

	const user = res;
	user.forEach(user => {
		user.created = user.created.getTime() / 1000 | 0;
		user.role = user.rank > 1 || user.score > 9999 ? 2 : 1;
	});

	return user;
}
