const UserService = require('../system/UserService');
const ModuleService = require('../system/ModuleService');

const router = module.exports = exports = express.Router();

/**
 * Set a module status
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {Number}  moduleId  ID of module to update
 * @path*  {Number}  status    The status of the module
 *                             0:default 1:fav 2:passed
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 */
router.put('/module/:moduleId/:status', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const moduleId = parseInt(req.params.moduleId);
	const status = parseInt(req.params.status);

	if(!moduleId || moduleId < 1)
		return res.status(400).end('Invalid ID supplied');

	if(status != 0 && status != 1 && status != 2)
		return res.status(400).end('Invalid status supplied');

	await ModuleService.updateModuleRel(moduleId, req.currentUser.id, {
		status: status
	});

	res.end('Object successfully updated');
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
 *        "short": "GI",
 *        "long": "Grundlagen der Informatik",
 *        "status": 0,
 *        "lastRequested": 0,
 *        "semester": 1,
 *        "questions": 42,
 *        "progress": 63
 *      }
 *    ]
 */
router.get('/modules', AppKeyAuth, TokenAuth, _(async function(req, res) {
	res.json(await ModuleService.getAllModules(req.currentUser.id));
}));
