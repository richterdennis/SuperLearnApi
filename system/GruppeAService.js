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
        module_id:          1,
        user_id:            userId,
        status:             1,
        level:              1,
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
 * Gets all the questions which creator is the given user
 *
 * @param   {Number}  userId  The question creator
 * @return  {Array}           The question array
 */
exports.getTopTen = async function() {
    const [err, res] = await db.query('SELECT nickname, level, exp FROM modules_user_rel INNER JOIN user on id = user_id ORDER BY level DESC, exp DESC LIMIT 10');
    if(err) throw err;
    return res;
}