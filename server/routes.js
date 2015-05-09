/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/companies', require('./api/company'));
  app.use('/api/screenshots', require('./api/screenshot'));
  app.use('/api/statuses', require('./api/status'));
  app.use('/api/priorities', require('./api/priority'));
  app.use('/api/lists', require('./api/list'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/stories', require('./api/story'));
  app.use('/api/projects', require('./api/project'));
  app.use('/api/teams', require('./api/team'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
