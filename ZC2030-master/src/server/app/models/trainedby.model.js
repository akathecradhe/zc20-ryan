/* eslint-disable global-require */
module.exports = (sequelize, Sequelize) => {
  const trainer = require('./trainer.model.js')(sequelize, Sequelize);
  const user = require('./participant.model.js')(sequelize, Sequelize);

  const TrainedBy = sequelize.define('trainedBy', {
    trainerId: {
      type: Sequelize.INTEGER,
      references: {
        model: trainer,
        key: 'id'
      }
    },
    participantId: {
      type: Sequelize.INTEGER,
      references: {
        model: user,
        key: 'id'
      }
    },
  }, {
    freezeTableName: true,
  });

  return TrainedBy;
};
