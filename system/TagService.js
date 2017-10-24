/**
 * Creates a tag
 *
 * @param   {Object}  tag  The tag to create
 * @return  {number}       The id of the inserted tag
 */
exports.createTag = async function(tag) {
	const data = {
		text: tag.text,
		user_id: 1337 // TODO: Replace with real user id
	};

	const [err, res] = db.query('INSERT INTO question_tags SET ?', data);
	if(err) throw err;

	return res.insertedId;
}
