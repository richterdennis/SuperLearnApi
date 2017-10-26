/**
 * Create a report
 *
 * @param   {Object}  reportData  The report data
 */
exports.createReport = async function(reportData) {
	const report = {
		report_type_id: reportData.reportTypeId,
		text:         reportData.text,
		question_id:   reportData.questionId
	};

	const [err, res] = await db.query('INSERT INTO reports SET ?', report);
	if(err) throw err;
}
