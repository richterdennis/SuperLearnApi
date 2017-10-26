const ReportService = require('../system/ReportService');
const UserService = require('../system/UserService');

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
router.post('/report', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const report = req.body;

	if(
		!report              ||
		!report.reportTypeId ||
		!report.text         ||
		!report.questionId
	) {
		return res.status(405).end('Invalid input');
	}

	await ReportService.createReport(report);
	res.status(201).end('Object successfully created');
}));

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
 * @response  {403}  Forbidden
 * @response  {404}  Object not found
 */
router.put('/report/:reportId/processed', AppKeyAuth, TokenAuth, _(async function(req, res) {
	const reportId = parseInt(req.params.reportId);

	if(!reportId || reportId < 1)
		return res.status(400).end('Invalid ID supplied');

	const user = await UserService.getUser(req.currentUser.id);
	if(!user)
		return res.status(404).end('User not found');

	if(user.role !== 2)
		return res.status(403).end('Forbidden');

	const success = await ReportService.updateReport(reportId, {
		processed: true
	});

	if(!success)
		return res.status(404).end('Object not found');

	res.end('Object successfully updated');
}));

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
router.get('/reports', AppKeyAuth, TokenAuth, function(req, res) {
	const user = await UserService.getUser(req.currentUser.id);
	if(!user)
		return res.status(404).end('User not found');

	if(user.role !== 2)
		return res.status(403).end('Forbidden');



	// getReports
});
