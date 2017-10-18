const express = require('express');
const router = express.Router();

router.get('/studiesCourses', function(req, res) {
	// getStudiesCourses
});
router.post('/studiesCourse/request', function(req, res) {
	// createStudiesCourseRequest
});

exports.router = router;
