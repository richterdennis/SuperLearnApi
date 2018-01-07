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
	let query, err, mainRes, res;

	query = `
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
		WHERE us.user_id = ? AND (mu.user_id = ? OR mu.user_id IS NULL)
	`;

	[err, mainRes] = await db.query(query, [userId, userId]);
	if(err) throw err;

	const modules = [];

	for (let i = 0; i < mainRes.length; i++) {
		const module = mainRes[i];

		// Add lastRequested
		query = `
			SELECT timestamp
			FROM rounds
			WHERE module_id = ?
			ORDER BY timestamp DESC
			LIMIT 1
		`;

		[err, res] = await db.query(query, [module.id]);
		if(err) throw err;

		module.lastRequested = res[0] && res[0].timestamp.getTime()  / 1000 | 0 || null;

		// Add questions
		query = `
			SELECT COUNT(id) as count
			FROM questions
			WHERE module_id = ?
		`;

		[err, res] = await db.query(query, [module.id]);
		if(err) throw err;

		module.questions = res[0] && res[0].count || 0;

		// Add progress
		query = `
			SELECT
				q.id,
				IFNULL(uq.star_counter, 0) as star_counter
			FROM questions q
				LEFT JOIN user_questions_rel uq
					ON q.id = uq.question_id AND uq.user_id = ?
			WHERE
				q.module_id = ?
		`;
		[err, res] = await db.query(query, [userId, module.id]);
		if(err) throw err;

		let one_counter = 0;
		let two_counter = 0;
		let three_or_more_counter = 0;

		res.forEach(row => {
			if(row.star_counter > 0)
				one_counter++;

			if(row.star_counter > 1)
				two_counter++;

			if(row.star_counter > 2)
				three_or_more_counter++;
		});

		if(res.length) {
			const percentOfOne = one_counter / res.length * 100;
			const percentOfTwo = two_counter / res.length * 100;
			const percentOfThree = three_or_more_counter / res.length * 100;

			module.progress = parseInt((percentOfOne + percentOfTwo + percentOfThree) / 3) || 0;
		}
		else
			module.progress = 0;

		modules.push(module);
	}

	return modules;
}
