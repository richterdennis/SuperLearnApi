/**
 * This creates a login for the given user id
 *
 * @param   {Number}  userId  The user id
 * @return  {Object}          The login
 */
exports.createLogin = async function(userId) {
	// TODO: Generate a JWT

	const data = {
		user_id: userId,
		device_id: '',
		token: '',
		expires: 0
	}

	const [err, res] = await db.query('INSERT INTO logins SET ?', data);
	if(err) throw err;

	return {
		token: '',
		expires: 0
	};
}
