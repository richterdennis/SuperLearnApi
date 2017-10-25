const AuthService = require('./AuthService');

/**
 * Creates a user
 *
 * @param   {Object}  user  The user
 * @return  {Number}        The user id
 */
exports.createUser = async function(user) {
	let data = {
		email:    user.email,
		nickname: user.nickname,
		rank_id:  user.rank
	};

	if(user.image)
		data.image = user.image;

	data.password = await AuthService.generateHash(user.password);

	let [err, res] = await db.query('INSERT INTO user SET ?', data);
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
