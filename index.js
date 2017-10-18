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

// Init services
UserService.init(api);
TokenService.init(api);
MedalService.init(api);
ModuleService.init(api);
QuestionService.init(api);
ReportService.init(api);
RoundService.init(api);
StudiesCourseService.init(api);
TagService.init(api);
VoteService.init(api);

// Start server
api.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}!`);
});
