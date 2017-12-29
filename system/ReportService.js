/**
 * Create a report
 *
 * @param   {Object}  reportData  The report data
 */
exports.createReport = async function(reportData) {
	let err, res;

	const report = {
		report_type_id: reportData.reportTypeId,
		text:         reportData.text,
		question_id:   reportData.questionId
	};

	[err, res] = await db.query('INSERT INTO reports SET ?', report);
	if(err) throw err;

	/*
	 * report types
	 * 1 => offensive
	 * 2 => duplicate
	 * 3 => spelling
	 * 4 => troll
	 * 5 => other
	 */
	if(reportData.reportTypeId == 1 || reportData.reportTypeId == 4) {
		let query = 'SELECT score FROM questions WHERE id = ?';

		[err, res] = await db.query(query, [reportData.questionId]);
		if(err) throw err;

		if(res[0].score > -5) return;

		query = 'UPDATE questions SET deleted = 1 WHERE id = ?';

		[err] = await db.query(query, [reportData.questionId]);
		if(err) throw err;
	}
}

/**
 * Update a report
 *
 * @param   {Number}  reportId    The report id
 * @param   {Object}  reportData  The report data
 * @return  {boolean}             success?
 */
exports.updateReport = async function(reportId, reportData) {
	const [err, res] = await db.query('UPDATE reports SET ? WHERE id = ?', [reportData, reportId]);
	if(err) throw err;

	return !!res.changedRows;
}

/**
 * Gets all unprocessed reports
 *
 * @return  {Array}  The report list
 */
exports.getUnprocessedReports = async function() {
	const [err, res] = await db.query('SELECT id, report_type_id, text, question_id, user_id, created FROM reports WHERE processed = 0');
	if(err) throw err;

	return res;
}
