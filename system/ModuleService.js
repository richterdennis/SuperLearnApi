/**
 * Update user module status
 * 
 * @param {Object} data update Data
 */
exports.updateModule = async function(moduleData) {
	const data = {
		module_id: moduleData.moduleId,
		passed: moduleData.passed,
		user_id: moduleData.user
	}

	const [err, res] = await db.query(
		'INSERT INTO modules_user_rel SET ? ON DUPLICATE KEY UPDATE passed = ? WHERE user_id = ? AND module_id = ?', 
		[data, data.passed, data.user_id, data.module_id]
	);
	 
	if (err) throw err;

	return !!res.changedRows || !!res.affectedRows;
}

/*
 *        "id": 1337,
 *        "text": "Grundlagen der Informatik",
 *        "passed": false,
 *        "lastRequested": 0,
 *        "semester": 1,
 *        "progress": 63
*/

exports.getAllModules = async function(moduleData) {
	const data = { user_id: moduleData };

	const [err, res] = await db.query(
		  'SELECT M.id AS id, M.text AS text, MU.passed as passed FROM modules M, modules_user_rel MU WHERE MU.user_id = ? AND MU.module_id = M.id',
		  data

	);
	if (err) throw err;

	return res;
}