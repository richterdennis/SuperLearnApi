const express = require('express');
const router = express.Router();

router.get('/token/test/{token}', function(req, res) {
	// testToken
});
router.get('/token/update/{token}', function(req, res) {
	// updateToken
});

exports.router = router;
