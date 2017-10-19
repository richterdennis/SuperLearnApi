const express = require('express');
const router = express.Router();

/**
 * Creates a new tag
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  Tag object that needs to be created
 *    {
 *      "text": "string"
 *    }
 *
 * @response  {201}  Object successfully created
 * @return  CreateResponse
 *    {
 *      "id": 1337
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/tag', function(req, res) {
	// createTag
});

/**
 * Get all tags wich matches the given search query
 * Returns an tag array of all tags
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @query  {string}  search  Query to search for
 *
 * @response  {200}  Successful operation
 * @return  Tags
 *    [
 *      {
 *        "id": 0,
 *        "text": "string"
 *      }
 *    ]
 */
router.get('/tags', function(req, res) {
	// getTags
});

module.exports = router;
