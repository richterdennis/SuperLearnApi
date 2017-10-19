// Config
const PORT = process.env.PORT || 8002;

// node_modules
const express = require('express');

// imports
const UserService          = require('./services/UserService');
const TokenService         = require('./services/TokenService');
const MedalService         = require('./services/MedalService');
const ModuleService        = require('./services/ModuleService');
const QuestionService      = require('./services/QuestionService');
const ReportService        = require('./services/ReportService');
const RoundService         = require('./services/RoundService');
const StudiesCourseService = require('./services/StudiesCourseService');
const TagService           = require('./services/TagService');
const VoteService          = require('./services/VoteService');

// Create Api
const api = express();

// Init routers from services

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
api.use('/api', UserService.router);

/**
 * token
 *
 * GET /token/test/:token    Test if a token is valid
 * GET /token/update/:token  Update a token before he is expiring
 */
api.use('/api', TokenService.router);

/**
 * medals
 * The medals are user specific and encourages the game motivation
 *
 * GET /medals  Get all medals for the logged in user
 */
api.use('/api', MedalService.router);

/**
 * module
 * A module is e. g. "PG - Programmieren Grundlagen"
 *
 * PUT /module/:moduleId/passed  Set an module to passed
 * GET /modules                  Get all modules
 */
api.use('/api', ModuleService.router);

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
api.use('/api', QuestionService.router);

/**
 * report
 * You can report a question (offensive, spelling ...)
 *
 * POST /report                       Creates a new report
 * PUT  /report/:reportId/processed  Set an existing report to processed
 * GET  /reports                      Get all unprocessed reports
 */
api.use('/api', ReportService.router);

/**
 * round
 * A game round is about 10 questions
 *
 * GET /round/module/:moduleId  Gets a random round from a given module ID
 * GET /round/user/:userId      Gets a random round from a given user ID
 * PUT /round/:roundId/finish   Updates an existing round to finish state
 */
api.use('/api', RoundService.router);

/**
 * studiesCourse
 * Your course of studies is maybe "Medieninformatik"
 *
 * GET  /studiesCourses         Get all courses of studies
 * POST /studiesCourse/request  Creates a request for a new course of studies
 */
api.use('/api', StudiesCourseService.router);

/**
 * tag
 * You can tag your questions to prevent duplicates
 *
 * POST /tag   Creates a new tag
 * GET  /tags  Get all tags wich matches the given search query
 */
api.use('/api', TagService.router);

/**
 * vote
 * Vote a question or a user
 *
 * PUT /vote/:value/question/:questionId  Updates an existing vote or create one
 * PUT /vote/:value/user/:userId          Updates an existing vote or create one
 */
api.use('/api', VoteService.router);

// Start server
api.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}!`);
});
