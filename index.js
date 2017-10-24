// Config
const API_PORT = process.env.API_PORT || 8002;

const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_USER     = process.env.DB_USER     || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_DATABASE = process.env.DB_DATABASE || 'superlearn';

// node_modules
global.express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// import helper functions
global.helper = require('./util/helper.js');

// import auth middlewares
global.AppKeyAuth = require('./authentication/AppKeyAuthMiddleware');
global.TokenAuth  = require('./authentication/TokenAuthMiddleware');

// import router
const UserRouter          = require('./routers/UserRouter');
const TokenRouter         = require('./routers/TokenRouter');
const MedalRouter         = require('./routers/MedalRouter');
const ModuleRouter        = require('./routers/ModuleRouter');
const QuestionRouter      = require('./routers/QuestionRouter');
const ReportRouter        = require('./routers/ReportRouter');
const RoundRouter         = require('./routers/RoundRouter');
const StudiesCourseRouter = require('./routers/StudiesCourseRouter');
const TagRouter           = require('./routers/TagRouter');
const VoteRouter          = require('./routers/VoteRouter');

// Start sql connection
global.db = mysql.createConnection({
  host:     DB_HOST,
  user:     DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
});

// Make some often used db functions async
db.query = helper.toAsync(db, db.query);

// connect to db
db.connect((err) => {
  if(err) {
    console.error('[SQL] Error connecting: ' + err.stack);
    throw err;
  }

  console.info('[SQL] Connected as id ' + db.threadId);
});

// Create Api
const api = express();
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Init routers

/**
 * me
 * This is the representation of your user object
 *
 * user
 * Go to another user profile then yours
 *
 * POST   /me              Creates a new user account
 * GET    /me              Gets my profile
 * PUT    /me              Updates my profile
 * DELETE /me              Deletes my user profile
 * POST   /me/login        Login with my email and my password
 * POST   /me/reset        Reset my password
 * GET    /confirm/:token  Confirm a reset request (Link from email)
 * PUT    /confirm/:token  Confirm a reset request
 * GET    /user/:userId    Gets an user by ID
 * GET    /user            Get best 10 user for a wall of fame
 */
api.use('/api', UserRouter);

/**
 * token
 *
 * GET /token/test/:token    Test if a token is valid
 * GET /token/update/:token  Update a token before he is expiring
 */
api.use('/api', TokenRouter);

/**
 * medals
 * The medals are user specific and encourages the game motivation
 *
 * GET /medals  Get all medals for the logged in user
 */
api.use('/api', MedalRouter);

/**
 * module
 * A module is e. g. "PG - Programmieren Grundlagen"
 *
 * PUT /module/:moduleId/passed  Set an module to passed
 * GET /modules                  Get all modules
 */
api.use('/api', ModuleRouter);

/**
 * question
 * A question can be of three types (boolean, exact or one of four)
 *
 * POST   /question               Creates a new question
 * PUT    /question/:questionId  Updates an existing question
 * DELETE /question/:questionId  Deletes an existing question but not for the creator
 * GET    /questions              Get all my questions
 * GET    /questions/random       Get a bunch of random questions
 * PUT    /answer/:answerId      Updates an existing answer
 * PUT    /solution/:solutionId  Updates an existing solution
 */
api.use('/api', QuestionRouter);

/**
 * report
 * You can report a question (offensive, spelling ...)
 *
 * POST /report                       Creates a new report
 * PUT  /report/:reportId/processed  Set an existing report to processed
 * GET  /reports                      Get all unprocessed reports
 */
api.use('/api', ReportRouter);

/**
 * round
 * A game round is about 10 questions
 *
 * GET /round/module/:moduleId  Gets a random round from a given module ID
 * GET /round/user/:userId      Gets a random round from a given user ID
 * PUT /round/:roundId/finish   Updates an existing round to finish state
 */
api.use('/api', RoundRouter);

/**
 * studiesCourse
 * Your course of studies is maybe "Medieninformatik"
 *
 * GET  /studiesCourses         Get all courses of studies
 * POST /studiesCourse/request  Creates a request for a new course of studies
 */
api.use('/api', StudiesCourseRouter);

/**
 * tag
 * You can tag your questions to prevent duplicates
 *
 * POST /tag   Creates a new tag
 * GET  /tags  Get all tags wich matches the given search query
 */
api.use('/api', TagRouter);

/**
 * vote
 * Vote a question or a user
 *
 * PUT /vote/:value/question/:questionId  Updates an existing vote or create one
 * PUT /vote/:value/user/:userId          Updates an existing vote or create one
 */
api.use('/api', VoteRouter);

// Start server
api.listen(API_PORT, function() {
  console.log(`Server is listening on port ${API_PORT}!`);
});
