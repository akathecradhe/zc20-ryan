/* eslint-disable global-require */
module.exports = (sequelize, Sequelize) => {
  const type = require('./type.model.js')(sequelize, Sequelize);

  const Category = sequelize.define('categories', {
    name: {
      type: Sequelize.STRING
    },
    typeId: {
      type: Sequelize.INTEGER,
      references: {
        model: type,
        key: 'id'
      }
    }
  });

  return Category;
};
