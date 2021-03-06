const router = module.exports = exports = express.Router();

/**
 * Get all medals for the logged in user
 * Returns an medal array of all medals
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  Medals
 *    [
 *      {
 *        "text": "my_questions_upvoted",
 *        "bronze": 10,
 *        "silver": 1000,
 *        "gold": 100000,
 *        "progress": 1337,
 *        "value": 2
 *      }
 *    ]
 */
router.get('/medals', AppKeyAuth, TokenAuth, function(req, res) {
	// getMedals
});
