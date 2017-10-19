// Config
const PORT = process.env.PORT || 8002;

// node_modules
const express = require('express');

// imports
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

// Create Api
const api = express();

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
api.use('/api', UserRouter.router);

/**
 * token
 *
 * GET /token/test/:token    Test if a token is valid
 * GET /token/update/:token  Update a token before he is expiring
 */
api.use('/api', TokenRouter.router);

/**
 * medals
 * The medals are user specific and encourages the game motivation
 *
 * GET /medals  Get all medals for the logged in user
 */
api.use('/api', MedalRouter.router);

/**
 * module
 * A module is e. g. "PG - Programmieren Grundlagen"
 *
 * PUT /module/:moduleId/passed  Set an module to passed
 * GET /modules                  Get all modules
 */
api.use('/api', ModuleRouter.router);

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
api.use('/api', QuestionRouter.router);

/**
 * report
 * You can report a question (offensive, spelling ...)
 *
 * POST /report                       Creates a new report
 * PUT  /report/:reportId/processed  Set an existing report to processed
 * GET  /reports                      Get all unprocessed reports
 */
api.use('/api', ReportRouter.router);

/**
 * round
 * A game round is about 10 questions
 *
 * GET /round/module/:moduleId  Gets a random round from a given module ID
 * GET /round/user/:userId      Gets a random round from a given user ID
 * PUT /round/:roundId/finish   Updates an existing round to finish state
 */
api.use('/api', RoundRouter.router);

/**
 * studiesCourse
 * Your course of studies is maybe "Medieninformatik"
 *
 * GET  /studiesCourses         Get all courses of studies
 * POST /studiesCourse/request  Creates a request for a new course of studies
 */
api.use('/api', StudiesCourseRouter.router);

/**
 * tag
 * You can tag your questions to prevent duplicates
 *
 * POST /tag   Creates a new tag
 * GET  /tags  Get all tags wich matches the given search query
 */
api.use('/api', TagRouter.router);

/**
 * vote
 * Vote a question or a user
 *
 * PUT /vote/:value/question/:questionId  Updates an existing vote or create one
 * PUT /vote/:value/user/:userId          Updates an existing vote or create one
 */
api.use('/api', VoteRouter.router);

// Start server
api.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}!`);
});
