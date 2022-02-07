/* eslint-disable global-require */
module.exports = (app) => {
  const auth = require('../controller/auth.controller.js');
  const router = require('express').Router();

  // Log in to participant/trainer/admin account
  router.post('/login', auth.logIn);

  // Get information from current user
  router.get('/info', auth.getInfo);

  app.use('/api/auth', router);
};
