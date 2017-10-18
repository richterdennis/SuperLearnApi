const express = require('express');
const router = express.Router();

router.put('/vote/{value}/question/{questionId}', function(req, res) {
	// voteQuestion
});
router.put('/vote/{value}/user/{userId}', function(req, res) {
	// voteUser
});

exports.router = router;
