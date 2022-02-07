/* eslint-disable global-require */
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const dbConfig = require('../db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false
});

function createDefaultAdmin(username, password, AdminDb) {
  // Create an Admin
  const admin = {
    username,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  };

  // Save Admin in the database
  AdminDb.create(admin)
    .then((data) => {
      console.log(`Admin ${data.username} successfully created`);
    })
    .catch((err) => {
      if (err.message === 'Validation error') {
        console.log('That username already exists.');
      } else {
        console.log(err.message || 'Some error occurred while creating the Admin.');
      }
    });
}

function createDefaultType(name, TypeDb) {
  // Create an organisation type
  TypeDb.create({
    name
  })
    .then((data) => {
      console.log(`Type ${data.name} successfully created`);
    })
    .catch((err) => {
      if (err.message === 'Validation error') {
        console.log('That type already exists.');
      } else {
        console.log(err.message || 'Some error occurred while creating the type.');
      }
    });
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admins = require('./admin.model.js')(sequelize, Sequelize);
db.participants = require('./participant.model.js')(sequelize, Sequelize);
db.organisations = require('./organisation.model.js')(sequelize, Sequelize);
db.types = require('./type.model.js')(sequelize, Sequelize);
db.trainers = require('./trainer.model.js')(sequelize, Sequelize);
db.passphrase = require('./passphrase.model.js')(sequelize, Sequelize);
db.trainedby = require('./trainedby.model.js')(sequelize, Sequelize);
db.calculatorCategory = require('./calculator_category.model.js')(sequelize, Sequelize);
db.calculatorInput = require('./calculator_input.model.js')(sequelize, Sequelize);
db.calculatorResult = require('./calculator_result.model.js')(sequelize, Sequelize);

db.trainers.belongsTo(db.organisations);
db.organisations.hasMany(db.trainers);
db.organisations.hasOne(db.types);

db.trainers.hasOne(db.passphrase);
db.passphrase.belongsTo(db.trainers);

db.participants.belongsToMany(db.trainers, { through: db.trainedby });
db.trainers.belongsToMany(db.participants, { through: db.trainedby });

db.calculatorCategory.hasMany(db.calculatorInput, { onDelete: 'CASCADE' });
db.calculatorInput.hasOne(db.calculatorCategory, { onDelete: 'CASCADE' });

db.calculatorResult.hasOne(db.calculatorInput, { onDelete: 'CASCADE' });
db.calculatorInput.hasMany(db.calculatorResult, { onDelete: 'CASCADE' });

// Creates a default admin account with username 'admin' and password 'TD7j2Wdx'
createDefaultAdmin('admin', 'TD7j2Wdx', db.admins);

// Creates a default organisation type with name 'Individual'
createDefaultType('Individual', db.types);

module.exports = db;
