const express = require('express');
const router = express.Router();

/**
 * Set an module to passed
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  moduleId  ID of module to update
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 */
router.put('/module/:moduleId/passed', function(req, res) {
	// updateModule
});

/**
 * Get all modules
 * Returns an module array of all modules
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  Modules
 *    [
 *      {
 *        "id": 1337,
 *        "text": "Grundalgen der Informatik",
 *        "passed": false,
 *        "lastRequested": 0,
 *        "semester": 1,
 *        "progress": 63
 *      }
 *    ]
 */
router.get('/modules', function(req, res) {
	// getModules
});

exports.router = router;
