const StudiesCourseService = require('../system/StudiesCourseService');

const router = module.exports = exports = express.Router();

/**
 * Get all courses of studies
 * Returns an course of studies array of all courses of studies
 *
 * @security  AppKeyAuth
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
router.get('/studiesCourses', AppKeyAuth, _(async function(req, res) {
	res.json(await StudiesCourseService.getStudiesCourses());
}));

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
router.post('/studiesCourse/request', AppKeyAuth, function(req, res) {
	// createStudiesCourseRequest
});
