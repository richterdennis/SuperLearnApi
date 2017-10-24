exports.createTag = function(tag) {
	return new Promise((result, reject) => {
		const data = {
			text: tag.text,
			user_id: 1337 // TODO: Replace with real user id
		};

		db.query('INSERT INTO question_tags SET ?', data, (err, res) => {
			if(err) return reject(err);

			result(res.insertedId);
		});
	});
}
