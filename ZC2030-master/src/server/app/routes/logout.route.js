/* eslint-disable global-require */
module.exports = (app) => {
  const auth = require('../controller/auth.controller.js');
  const router = require('express').Router();

  // Log in to participant/trainer/admin account
  router.get('/', auth.logout);

  app.use('/logout', router);
};
