exports.isValidApp = function(key) {
	return new Promise((result, reject) => {
		db.query('SELECT valid FROM App WHERE token = ?', [key], (err, res) => {
			if(err) return reject(err);

			result(res.length && res[0].valid);
		});
	});
}
