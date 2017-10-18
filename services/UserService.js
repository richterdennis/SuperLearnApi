const express = require('express');
const router = express.Router();

router.post('/me', function(req, res) {
	// createUser
});
router.get('/me', function(req, res) {
	// getUser
});
router.put('/me', function(req, res) {
	// updateUser
});
router.delete('/me', function(req, res) {
	// deleteUser
});
router.post('/me/login', function(req, res) {
	// loginUser
});
router.post('/me/reset', function(req, res) {
	// createResetToken
});
router.get('/confirm/{token}', function(req, res) {
	// confirmResetToken
});
router.put('/confirm/{token}', function(req, res) {
	// resetPassword
});

router.get('/user/{userId}', function(req, res) {
	// getUser
});
router.get('/user', function(req, res) {
	// getUsers
});

exports.router = router;
