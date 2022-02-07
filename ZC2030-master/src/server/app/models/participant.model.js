module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('participants', {
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
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
  });

  return User;
};
