exports.init = function(api) {
	api.get('/round/module/{moduleId}', function(req, res) {
		// getRoundFromModule
	});
	api.get('/round/user/{userId}', function(req, res) {
		// getRoundFromUser
	});
	api.put('/round/{roundId}/finish', function(req, res) {
		// updateRound
	});
}
