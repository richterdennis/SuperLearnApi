const TagService = require('../system/TagService');

const router = module.exports = exports = express.Router();

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
router.post('/tag', AppKeyAuth, TokenAuth, function(req, res) {
	const tag = req.body;

	if(!tag) return res.status(405).end("Invalid input");

	TagService.createTag(tag).then((id) => {
		res.status(201).json({id});
	});
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
router.get('/tags', AppKeyAuth, TokenAuth, function(req, res) {
	// getTags
	res.status(200).end();
});
