exports.init = function(api) {
	api.post('/question', function(req, res) {
		// createQuestion
	});
	api.put('/question/{questionId}', function(req, res) {
		// updateQuestion
	});
	api.delete('/question/{questionId}', function(req, res) {
		// deleteQuestion
	});
	api.get('/questions', function(req, res) {
		// getMyQuestions
	});
	api.get('/questions/random', function(req, res) {
		// getRandomQuestions
	});
	api.put('/answer/{answerId}', function(req, res) {
		// updateAnswer
	});
	api.put('/solution/{solutionId}', function(req, res) {
		// updateSolution
	});
}
