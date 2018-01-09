/**
 * Creates a progress
 *
 * @param   {Number}  userId        The creator
 * @param   {Object}  progressData  The question data
 * @return  {Number|false}          The new question id or false on fail
 */
exports.createProgress = async function(userId, progressData) {

    // insert progress
    let data = {
        module_id:          progressData.module_id,
        user_id:            userId,
        status:             1,
        level:              progressData.level,
        exp:                0,
        reached_milestones: 0
    };
    let [err, res] = await db.query('INSERT INTO modules_user_rel SET ?', data);
    if(err) throw err;
    return res.affectedRows;
}

/**
 * Updates a progress
 *
 * @param   {Number}  userId      The changer
 * @param   {Object}  data        The progress data to change
 * @return  {Number}              The status of the success
 */
exports.updateProgress = async function(userId, data) {
    [err] = await db.query('UPDATE modules_user_rel SET ? WHERE user_id = ?', [data, userId]);
    if(err) throw err;

    return 200;
}

/**
 * Updates overAll module
 *
 * @param   {Number}  userId      The changer
 * @param   {Object}  data        The progress data to change
 * @return  {Number}              The status of the success
 */
exports.updateOverAll = async function(userId, data) {
    [err] = await db.query('UPDATE modules_user_rel SET ? WHERE user_id = ? and module_id = 100', [data, userId]);
    if(err) throw err;

    return 200;
}

/**
 * Gets all the questions which creator is the given user
 *
 * @param   {Number}  userId  The question creator
 * @return  {Array}           The question array
 */
exports.getTopTen = async function() {
    const [err, res] = await db.query('SELECT nickname, level, exp FROM modules_user_rel INNER JOIN user on id = user_id WHERE module_id = 100 ORDER BY level DESC, exp DESC LIMIT 10');
    if(err) throw err;
    return res;
}

/**
 * Gets all level
 *
 * @param   {Number}  userId        The creator
 * @return  {Array}   moduleIds plus level
 */
exports.getAllLevel = async function(userId) {
    let [err, res] = await db.query('SELECT module_id, level, exp from modules_user_rel WHERE user_id = ? and module_id != 100', userId);
    if(err) throw err;
    return res;
}

/**
 * Gets overall level
 *
 * @param   {Number}  userId        The creator
 * @return  {Array}   Your overall level
 */
exports.getOverAllLevel = async function(userId) {
    let [err, res] = await db.query('SELECT level from modules_user_rel WHERE user_id = ? and module_id = 100', userId);
    if(err) throw err;
    return res;
}

/**
 * Creates a firebase
 *
 * @param   {Number}  userId        The creator
 * @param   {Object}  firebaseData  The firebase data
 * @return  {Number|false}          The new question id or false on fail
 */
exports.createFirebase = async function(userId, firebaseData) {

    // insert firebase
    let data = {
        user_id:            userId,
        token:              firebaseData.token
    };

    let [err, res] = await db.query('INSERT INTO firebase SET ?', data);
    if(err) throw err;

    return res.affectedRows;
}

/**
 * Gets all the possible duel opponents
 *
 * @return {Array} The opponent array
 */
exports.getFirebase = async function(user_id) {
    const [err, res] = await db.query('SELECT nickname, token FROM firebase INNER JOIN user on id = user_id WHERE user_id != ?', user_id);
    if(err) throw err;
    return res;
}