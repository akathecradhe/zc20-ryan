/* eslint-disable global-require */
module.exports = (app) => {
  const calc = require('../controller/calculator.controller.js');
  const router = require('express').Router();

  // Create a calculator input
  router.post('/new-input', calc.newInput);

  // Update an input with id
  router.put('/update-input', calc.updateInput);

  // Delete an input with id
  router.delete('/delete-input', calc.deleteInput);

  // Return all input data from category
  router.post('/category-inputs', calc.getCategoryInputs);

  // Return all category info
  router.get('/category', calc.categories);

  // Return all category info, given a typeId, admin only
  router.post('/categories-from-type', calc.categoriesFromTypeId);

  // Create a category
  router.post('/new-category', calc.newCategory);

  // Update a category with id
  router.put('/update-category', calc.updateCategory);

  // Delete a category with id
  router.delete('/delete-category', calc.deleteCategory);

  // Returns the % complete of each category
  router.get('/category-percentage', calc.getPercent);

  // Get a list of results
  router.get('/results', calc.getResults);

  // Get totals for user, group and organisation
  router.get('/totals', calc.getTotals);

  // Save and calculate user result
  router.post('/new-result', calc.newResult);

  // Delete a result with the specified id in the request
  router.delete('/delete-result', calc.deleteResult);

  // Delete all Results with the specified participantId in the session
  router.delete('/delete-participant-results', calc.deleteAllParticipantResults);

  app.use('/api/calc', router);
};
