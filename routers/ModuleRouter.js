const router = module.exports = exports = express.Router();

/**
 * Set an module to passed
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  moduleId  ID of module to update
 * @path*  {integer}  passed    passed or unpassed
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {404}  Object not found
 */
router.put('/module/:moduleId/:passed', AppKeyAuth, TokenAuth, function(req, res) {
	// updateModule
	res.status(200).end();
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
 *        "text": "Grundlagen der Informatik",
 *        "fav": false,
 *        "passed": false,
 *        "lastRequested": 0,
 *        "semester": 1,
 *        "questions": 42,
 *        "progress": 63
 *      }
 *    ]
 */
router.get('/modules', AppKeyAuth, TokenAuth, function(req, res) {
	// getModules
	res.status(200).end();
});
