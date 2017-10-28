const UserService = require('../system/UserService');
const ModuleService = require('../system/ModuleService');

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
router.put('/module/:moduleId/:passed', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const moduleId = parseInt(req.params.moduleId);

	if (!moduleId || moduleId < 1)
		return res.status(400).end('Invalid ID supplied');

	const passed = parseInt(req.params.passed);
	const user = await UserService.getUser(req.currentUser.id);

	if (!user)
		return res.status(404).end('User not found');
	
	await ModuleService.updateModule({
		module_id: moduleId,
		user_id: user,
		passed: passed
	});

	res.status(200).end();
}));

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
 *        "passed": false,
 *        "lastRequested": 0,
 *        "semester": 1,
 *        "progress": 63
 *      }
 *    ]
 */
router.get('/modules', AppKeyAuth, TokenAuth, function(req, res) {
	// getModules
	res.status(200).end();
});
