/**
 * Update the module relationship to the user
 *
 * @param   {Number}  moduleId    The module id
 * @param   {Number}  userId      The user id
 * @param   {Object}  updateData  The update value
 * @return  {boolean}             Success?
 */
exports.updateModuleRel = async function(moduleId, userId, updateData) {
	const insertData = Object.assign({}, updateData, {
		module_id: moduleId,
		user_id: userId
	});

	const query = `
		INSERT INTO modules_user_rel SET ?
		ON DUPLICATE KEY
		UPDATE ?
	`;

	const [err, res] = await db.query(query, [insertData, updateData]);
	if(err) throw err;

	return !!res.affectedRows;
}

/**
 * Get all the relevant modules for a given user
 *
 * @param   {Number}  userId  The user id
 * @return  {Array}           The modules
 */
exports.getAllModules = async function(userId) {
	const query = `
		SELECT
			m.id,
			m.short,
			m.long,
			IFNULL(mu.status, 0) as status,
			sm.semester
		FROM modules m
			JOIN studies_courses_modules_rel sm
				ON m.id = sm.module_id
			JOIN user_studies_courses_rel us
				ON sm.studies_course_id = us.studies_course_id
			LEFT JOIN modules_user_rel mu
				ON m.id = mu.module_id
		WHERE us.user_id = ?
	`;

	const [err, res] = await db.query(query, [userId]);
	if (err) throw err;

	// TODO: Add lastRequested, questions, progress

	return res;
}
