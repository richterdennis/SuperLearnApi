const express = require('express');
const router = express.Router();

router.post('/question', function(req, res) {
	// createQuestion
});
router.put('/question/{questionId}', function(req, res) {
	// updateQuestion
});
router.delete('/question/{questionId}', function(req, res) {
	// deleteQuestion
});
router.get('/questions', function(req, res) {
	// getMyQuestions
});
router.get('/questions/random', function(req, res) {
	// getRandomQuestions
});
router.put('/answer/{answerId}', function(req, res) {
	// updateAnswer
});
router.put('/solution/{solutionId}', function(req, res) {
	// updateSolution
});

exports.router = router;
