/**
 * Creates a tag
 *
 * @param   {Object}  tag  The tag to create
 * @return  {Number}       The id of the inserted tag
 */
exports.createTag = async function(tag) {
	const data = {
		text: tag.text,
		user_id: 1337 // TODO: Replace with real user id
	};

	const [err, res] = await db.query('INSERT INTO question_tags SET ?', data);
	if(err) throw err;

	return res.insertId;
}
