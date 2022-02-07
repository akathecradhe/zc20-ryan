/* eslint-disable global-require */
module.exports = (sequelize, Sequelize) => {
  const type = require('./type.model.js')(sequelize, Sequelize);

  const Organisation = sequelize.define('organisations', {
    name: {
      type: Sequelize.STRING,
      unique: {
        args: 'username',
        msg: 'The name is already taken!'
      }
    },
    typeId: {
      type: Sequelize.INTEGER,
      references: {
        model: type,
        key: 'id'
      }
    }
  });

  return Organisation;
};
