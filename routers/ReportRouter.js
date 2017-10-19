const router = module.exports = exports = express.Router();

/**
 * Creates a new report
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @body*  {Object}  Report object that needs to be created
 *    {
 *      "reportTypeId": "1:offensive",  | required
 *      "text": "string",               |
 *      "questionId": 0                <|>
 *    }
 *
 * @response  {201}  Object successfully created
 * @response  {405}  Invalid input
 */
router.post('/report', function(req, res) {
	// createReport
});

/**
 * Set an existing report to processed
 * This can only be done if you have manager rights
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @path*  {integer}  reportId  ID of question to update
 *
 * @response  {200}  Object successfully updated
 * @response  {400}  Invalid ID supplied
 * @response  {403}  Forbitten
 * @response  {404}  Object not found
 */
router.put('/report/:reportId/processed', function(req, res) {
	// updateReport
});

/**
 * Get all unprocessed reports
 * This can only be done if you have manager rights.
 * Returns an report array of all unprocessed reports
 *
 * @security  AppKeyAuth, TokenAuth
 *
 * @response  {200}  Successful operation
 * @return  Reports
 *    [
 *      {
 *        "id": 0,
 *        "reportTypeId": "1:offensive",
 *        "text": "string",
 *        "questionId": 0,
 *        "userId": 0,
 *        "created": 0
 *      }
 *    ]
 *
 * @response  {403}  Forbitten
 */
router.get('/reports', function(req, res) {
	// getReports
});
