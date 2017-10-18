const express = require('express');
const router = express.Router();

router.get('/round/module/{moduleId}', function(req, res) {
	// getRoundFromModule
});
router.get('/round/user/{userId}', function(req, res) {
	// getRoundFromUser
});
router.put('/round/{roundId}/finish', function(req, res) {
	// updateRound
});

exports.router = router;
