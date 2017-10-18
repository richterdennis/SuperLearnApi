const express = require('express');
const router = express.Router();

router.post('/report', function(req, res) {
	// createReport
});
router.put('/report/{reportId}/processed', function(req, res) {
	// updateReport
});
router.get('/reports', function(req, res) {
	// getReports
});

exports.router = router;
