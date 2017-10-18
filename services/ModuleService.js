const express = require('express');
const router = express.Router();

router.put('/module/{moduleId}/passed', function(req, res) {
	// updateModule
});
router.get('/modules', function(req, res) {
	// getModules
});

exports.router = router;
