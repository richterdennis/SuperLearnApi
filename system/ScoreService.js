/**
 * Updates the user score
 *
 * @param   {Number}  userId  The user which score will be updated
 * @param   {Number}  value   The add value
 */
exports.updateUserScore = async function(userId, value) {
	const query = `UPDATE user SET score = score + ? WHERE id = ?`;

	const [err] = await db.query(query, [value, userId]);
	if(err) throw err;
}
