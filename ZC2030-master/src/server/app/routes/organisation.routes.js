/* eslint-disable global-require */
module.exports = (app) => {
  const organisation = require('../controller/organisation.controller.js');
  const router = require('express').Router();

  // Create a new organisation and trainer
  router.post('/create', organisation.create);

  // Get all organisation types
  router.get('/types', organisation.getTypes);

  // Create a new organisation type
  router.post('/new-type', organisation.newType);

  // Delete an organisation type
  router.delete('/delete-type', organisation.deleteType);

  app.use('/api/organisations', router);
};
