exports.init = function(api) {
	api.get('/token/test/{token}', function(req, res) {
		// testToken
	});
	api.get('/token/update/{token}', function(req, res) {
		// updateToken
	});
}
