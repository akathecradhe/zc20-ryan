/* eslint-disable global-require */
module.exports = (sequelize, Sequelize) => {
  const category = require('./calculator_category.model.js')(sequelize, Sequelize);

  const Input = sequelize.define('inputs', {
    categoryId: {
      type: Sequelize.INTEGER,
      references: {
        model: category,
        key: 'id'
      }
    },
    name: {
      type: Sequelize.STRING
    },
    factor: {
      type: Sequelize.DOUBLE
    },
    unit: {
      type: Sequelize.STRING
    }
  });

  return Input;
};
