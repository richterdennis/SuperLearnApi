exports.init = function(api) {
	api.post('/me', function(req, res) {
		// createUser
	});
	api.get('/me', function(req, res) {
		// getUser
	});
	api.put('/me', function(req, res) {
		// updateUser
	});
	api.delete('/me', function(req, res) {
		// deleteUser
	});
	api.post('/me/login', function(req, res) {
		// loginUser
	});
	api.post('/me/reset', function(req, res) {
		// createResetToken
	});
	api.get('/confirm/{token}', function(req, res) {
		// confirmResetToken
	});
	api.put('/confirm/{token}', function(req, res) {
		// resetPassword
	});

	api.get('/user/{userId}', function(req, res) {
		// getUser
	});
	api.get('/user', function(req, res) {
		// getUsers
	});
}
