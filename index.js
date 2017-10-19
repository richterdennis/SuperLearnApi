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

api.use('/api', TokenService.router);
api.use('/api', MedalService.router);
api.use('/api', ModuleService.router);
api.use('/api', QuestionService.router);
api.use('/api', ReportService.router);
api.use('/api', RoundService.router);
api.use('/api', StudiesCourseService.router);
api.use('/api', TagService.router);
api.use('/api', VoteService.router);

// Start server
api.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}!`);
});
