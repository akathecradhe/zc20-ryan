/* eslint-disable global-require */
module.exports = (sequelize, Sequelize) => {
  const participant = require('./participant.model.js')(sequelize, Sequelize);
  const calculatorInput = require('./calculator_input.model.js')(sequelize, Sequelize);

  const Result = sequelize.define('results', {
    inputId: {
      type: Sequelize.INTEGER,
      references: {
        model: calculatorInput,
        key: 'id'
      }
    },
    participantId: {
      type: Sequelize.INTEGER,
      references: {
        model: participant,
        key: 'id'
      }
    },
    quantity: {
      type: Sequelize.DOUBLE
    },
    result: {
      type: Sequelize.DOUBLE
    }
  });

  return Result;
};
