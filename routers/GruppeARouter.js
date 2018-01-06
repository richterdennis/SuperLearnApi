const GruppeAService = require('../system/GruppeAService');
const UserService = require('../system/UserService');

const router = module.exports = exports = express.Router();

/**
 * Creates a new question
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  Progress object that needs to be created
 *    {
 *
 *    }
 *
 * @response  {201}  Object successfully created
 * @return  CreateResponse
 *    {
 *
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/groupA/progress', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const progress = req.body;
    const userId = req.currentUser.id;

    if(
        !progress
    ) {
        return res.status(405).end('Invalid inputA');
    }

    const affectedRows = await GruppeAService.createProgress(userId, progress);
    if(affectedRows == 0)
        return res.status(405).end('Invalid inputB');

    res.status(201).json({

    });
}));

/**
 * Updates an existing question
 * This can only be done if this is your question or you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  userId  ID of progress to update
 *
 * @body*  {Object}  progress object
 *    {
 *      "level":                2,
 *      "exp":                  33,
 *      "reached_milestones":   2
 *    }
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 * @response  {405}  Invalid input
 */
router.put('/groupA/progress', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const userId = req.currentUser.id;

    if(!userId || userId < 1)
        return res.status(400).end('Invalid ID supplied');

    let changes = 0;
    const update = {};

    if(req.body.level) {
        update.level = req.body.level;
        changes++;
    }

    if (req.body.exp) {
        update.exp = req.body.exp;
        changes++;
    }

    if (req.body.reached_milestones) {
        update.reached_milestones = req.body.reached_milestones;
        changes++;
    }

    if(!changes)
        return res.status(405).end('Invalid input');



    const status = await GruppeAService.updateProgress(userId, update);

    switch(status) {
        case 200: res.end('Object successfully updated');  break;
        case 403: res.status(403).end('Forbidden');        break;
        case 404: res.status(404).end('Object not found'); break;
        default:
            res.sendStatus(status);
    }
}));

/**
 * Get all my questions
 * Returns an question array of all my questions
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  ranking
 *    [
 *       {
 *           "user_id": 4,
 *           "level": 5,
 *           "exp": 0
 *       },
 *       {
 *           "user_id": 6,
 *           "level": 3,
 *           "exp": 0
 *       },
 *       {
 *           "user_id": 3,
 *           "level": 2,
 *           "exp": 33
 *       },
 *       {
 *           "user_id": 2,
 *           "level": 2,
 *           "exp": 12
 *       },
 *       {
 *           "user_id": 1,
 *           "level": 2,
 *           "exp": 5
 *       },
 *       {
 *           "user_id": 5,
 *           "level": 1,
 *           "exp": 0
 *       }
 *   ]
 */
router.get('/groupA/progress', AppKeyAuth, _(async function(req, res) {

    res.json(await GruppeAService.getTopTen());
}));