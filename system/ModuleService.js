exports.updateModule = async function(data) {
    const [err, res] = 
        await db.query('INSERT INTO modules_user_rel SET ? ON DUPLICATE KEY UPDATE passed = ?', 
        [data, data.passed]
    );
    
    if (err) throw err;

    return res;
}