'use strict';

const Authentication = require('./controllers/authentication');

module.exports = function router(app) {
  app.post('/signup', Authentication.signup);
};
