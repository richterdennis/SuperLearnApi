const express = require('express');
const router = express.Router();

/**
 * Get all courses of studies
 * Returns an course of studies array of all courses of studies
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  StudiesCourses
 *    [
 *      {
 *        "id": 0,
 *        "text": "string"
 *      }
 *    ]
 */
router.get('/studiesCourses', function(req, res) {
	// getStudiesCourses
});

/**
 * Creates a request for a new course of studies
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  StudiesCourseRequest object that needs to be created
 *    {
 *      "text": "string"
 *    }
 *
 * @response  {201}  Object successfully created
 * @response  {405}  Invalid input
 */
router.post('/studiesCourse/request', function(req, res) {
	// createStudiesCourseRequest
});

module.exports = router;
