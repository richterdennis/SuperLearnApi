const GruppeAService = require('../system/GruppeAService');
const UserService = require('../system/UserService');

const router = module.exports = exports = express.Router();

/**
 * Creates a new progress
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
 *      "module_id": 1
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/groupA/progress', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const progress = req.body;
    const userId = req.currentUser.id;

    if(
        !progress ||
        !progress.module_id ||
        !progress.level
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
 * Updates an existing progress
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
    const data = req.body;

    if(
        !data ||
        !data.module_id
    ) {
        return res.status(405).end('Invalid inputA');
    }

    if(!userId || userId < 1)
        return res.status(400).end('Invalid ID supplied');

    let changes = 0;
    const update = {};

    if(data.level) {
        update.level = data.level;
        changes++;
    }

    if (data.exp) {
        update.exp = data.exp;
        changes++;
    }

    if (data.reached_milestones) {
        update.reached_milestones = data.reached_milestones;
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
 * Updates an existing progress
 * This can only be done if this is your progress or you have manager rights
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
router.put('/groupA/progress/overAllLevel', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const userId = req.currentUser.id;
    const data = req.body;

    if(
        !data
    ) {
        return res.status(405).end('Invalid inputA');
    }

    if(!userId || userId < 1)
        return res.status(400).end('Invalid ID supplied');

    let changes = 0;
    const update = {};

    if(data.level) {
        update.level = data.level;
        changes++;
    }

    if (data.exp) {
        update.exp = data.exp;
        changes++;
    }

    if (data.reached_milestones) {
        update.reached_milestones = data.reached_milestones;
        changes++;
    }

    if(!changes)
        return res.status(405).end('Invalid input');



    const status = await GruppeAService.updateOverAll(userId, update);

    switch(status) {
        case 200: res.end('Object successfully updated');  break;
        case 403: res.status(403).end('Forbidden');        break;
        case 404: res.status(404).end('Object not found'); break;
        default:
            res.sendStatus(status);
    }
}));

/**
 * Get the topTen
 * Returns an question array of all my progress
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

/**
 * Gets all level
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}
 *    {
 *
 *    }
 *
 * @response  {201}  Object successfully created
 * @return  CreateResponse
 *    {
 *      "module_id": 1,
 *      "level": 4
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/groupA/progress/allLevel', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const userId = req.currentUser.id;
    res.json(await GruppeAService.getAllLevel(userId));
}));

/**
 * Gets overall level
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}
 *    {
 *
 *    }
 *
 * @response  {201}  Object successfully created
 * @return  CreateResponse
 *    {
 *      "level": 4
 *    }
 *
 * @response  {405}  Invalid input
 */
router.post('/groupA/progress/overAllLevel', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const userId = req.currentUser.id;
    res.json(await GruppeAService.getOverAllLevel(userId));
}));

/**
 * Creates a new firebase entry
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  firebase object that needs to be created
 *    {
 *          "token": "6a7c1f6f4c54cf24edc9b3587e40708c"
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
router.post('/groupA/firebase', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const firebase = req.body;
    const userId = req.currentUser.id;

    if(
        !firebase
    ) {
        return res.status(405).end('Invalid inputA');
    }

    const affectedRows = await GruppeAService.createFirebase(userId, firebase);
    if(affectedRows == 0)
        return res.status(405).end('Invalid inputB');

    res.status(201).json({

    });
}));

/**
 * Gets all the possible duel opponents
 * Returns an array of all my opponents
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  ranking
 * [
 *   {
 *       "nickname": "m1",
 *       "token": "6b7c1f6f4c54cf24edc9b3587e407745"
 *   },
 *   {
 *       "nickname": "mb",
 *       "token": "6a7c1f6f4c54cf24edc9b3587e40708c"
 *   }
 * ]
 */
router.get('/groupA/firebase', AppKeyAuth, TokenAuth, _(async function(req, res) {
    const userId = req.currentUser.id;
    res.json(await GruppeAService.getFirebase(userId));
}));