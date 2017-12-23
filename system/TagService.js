/**
 * Creates a tag
 *
 * @param   {Object}  tag  The tag to create
 * @return  {Number}       The id of the inserted tag
 */
exports.createTag = async function(userId, tag) {
	const data = {
		text: tag.text.toLowerCase(),
		user_id: userId
	};

	const [err, res] = await db.query('INSERT INTO question_tags SET ?', data);
	if(err) throw err;

	return res.insertId;
}

/**
 * Search through all tags
 *
 * @param   {String}  search  The search query
 * @return  {Array}           List of tags
 */
exports.getTags = async function(search) {
	search = search.toLowerCase();

	const [err, res] = await db.query('SELECT id, text FROM question_tags WHERE text LIKE ? LIMIT 10', ['%' + search + '%']);
	if(err) throw err;

	return res;
}
