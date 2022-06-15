const healthy = require('./healthy.controller');
const userController = require('./users.controller');
const authController = require('./auth.controller');

/**
 *
 * @param app {Application}
 */
module.exports = (app) => {
  app.use('/', healthy);
  app.use('/users', userController);
  app.use('/auth', authController);
};
