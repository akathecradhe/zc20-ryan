/* eslint-disable global-require */
module.exports = (sequelize, Sequelize) => {
  const organisation = require('./organisation.model.js')(sequelize, Sequelize);

  const Trainer = sequelize.define('trainers', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
      unique: {
        args: 'username',
        msg: 'The username is already taken!'
      }
    },
    password: {
      type: Sequelize.STRING
    },
    canManage: {
      type: Sequelize.BOOLEAN
    },
    organisationId: {
      type: Sequelize.INTEGER,
      references: {
        model: organisation,
        key: 'id'
      }
    }
  });

  return Trainer;
};
