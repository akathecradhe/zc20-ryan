module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('administrators', {
    username: {
      type: Sequelize.STRING,
      unique: {
        args: 'username',
        msg: 'The username is already taken!'
      }
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return Admin;
};
