/* eslint-disable global-require */
module.exports = (app) => {
  const users = require('../controller/participant.controller.js');
  const router = require('express').Router();

  // Create a new Participant
  router.post('/create', users.create);

  // Update a Participant with id
  router.put('/update', users.update);

  // Link to a trainer from passphrase
  router.post('/linkPassphrase', users.linkPass);

  app.use('/api/participants', router);
};
