/**
 * Gets all courses of studies
 *
 * @return  {Array}  The course of studies list
 */
exports.getStudiesCourses = async function() {
	const [err, res] = await db.query('SELECT id, text FROM studies_courses ORDER BY text');
	if(err) throw err;

	return res;
}
