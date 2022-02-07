module.exports = (sequelize, Sequelize) => {
  const Passphrase = sequelize.define('passphrases', {
    passphrase: {
      type: Sequelize.STRING
    }
  });

  return Passphrase;
};
