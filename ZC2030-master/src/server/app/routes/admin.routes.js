/* eslint-disable global-require */
module.exports = (app) => {
  const admins = require('../controller/admin.controller.js');
  const router = require('express').Router();

  // Create a new Admin
  router.post('/create', admins.create);

  // Update a Admin with id
  router.put('/update', admins.update);

  // Delete a Admin with id
  router.delete('/delete', admins.delete);

  app.use('/api/admin', router);
};
