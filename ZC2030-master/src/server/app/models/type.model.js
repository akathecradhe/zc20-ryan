module.exports = (sequelize, Sequelize) => {
  const Type = sequelize.define('types', {
    name: {
      type: Sequelize.STRING,
      unique: {
        args: 'name',
        msg: 'The name is already taken!'
      }
    }
  });

  return Type;
};
