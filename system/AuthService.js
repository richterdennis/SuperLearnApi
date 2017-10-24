/**
 * Checks if the given key is a valid app key
 *
 * @param   {string}   key  The app key
 * @return  {Boolean}       isValid?
 */
exports.isValidApp = async function(key) {
	const [err, rows] = await db.query('SELECT valid FROM App WHERE token = ?', [key]);
	if(err) throw err;

	return rows.length && rows[0].valid;
}
