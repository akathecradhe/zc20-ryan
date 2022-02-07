/* eslint-disable global-require */
module.exports = (app) => {
  const trainers = require('../controller/trainer.controller.js');
  const router = require('express').Router();

  // Create a new Trainer
  router.post('/create', trainers.create);

  // Generate a new linking passphrase
  router.get('/generatePassphrase', trainers.generatePass);

  // Update a Trainer with id
  router.put('/update', trainers.update);

  app.use('/api/trainers', router);
};
