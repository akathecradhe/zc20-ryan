const bcrypt = require('bcrypt');
const randomWords = require('random-words');
const db = require('../models');

const Trainer = db.trainers;
const Passphrase = db.passphrase;

// Create and Save a new Trainer
exports.create = (req, res) => {
  if (req.session.type !== 'trainer') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.password) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  async function getOrganisationID(id) {
    const data = await Trainer.findByPk(id);

    if (!data) {
      res.status(400).send({
        message: `Error retrieving Organisation with id=${id}`
      });
    }

    return data.organisationId;
  }

  async function canManage(id) {
    const data = await Trainer.findByPk(id);

    return data.canManage;
  }

  async function createTrainer(id) {
    const organisationId = await getOrganisationID(id);

    if (organisationId === null) {
      return null;
    }

    // Create a Trainer
    const trainer = {
      organisationId,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      canManage: req.body.canManage
    };

    return trainer;
  }

  async function main() {
    try {
      if (!await canManage(req.session.userId)) {
        res.status(401).send({
          message: 'You do not have management rights'
        });
        return;
      }

      // Save Trainer in the database
      Trainer.create(await createTrainer(req.session.userId))
        .then((data) => {
          res.status(201).send({
            message: `Trainer ${data.username} successfully created`
          });
        })
        .catch((err) => {
          if (err.message === 'Validation error') {
            res.status(409).send({
              message: 'That username already exists.'
            });
          } else {
            res.status(500).send({
              message:
                  err.message || 'Some error occurred while creating the User.'
            });
          }
        });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Trainer.'
      });
    }
  }

  main();
};

// Update a Trainer by the id in the request
exports.update = (req, res) => {
  const id = req.session.userId;

  if (req.session.type !== 'trainer') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  // Create an updated trainer
  const trainer = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  Trainer.update(trainer, {
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Trainer was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Trainer with id=${id}. Maybe Trainer was not found or req.body is empty!`
        });
      }
    })
    .catch((err) => {
      if (err.message === 'Validation error') {
        res.status(409).send({
          message: 'That username already exists.'
        });
      } else {
        res.status(500).send({
          message:
              err.message || `Error updating Trainer with id=${id}`
        });
      }
    });
};

// Generate a random passphrase linking to the trainer
exports.generatePass = (req, res) => {
  if (req.session.type !== 'trainer') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Create a Trainer
  const trainer = {
    trainerId: req.session.userId,
    passphrase: randomWords({ exactly: 1, wordsPerString: 3, separator: '-' })[0]
  };

  // Save Passphrase in the database
  Passphrase.create(trainer)
    .then((data) => {
      res.json({ passphrase: data.passphrase });
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || 'Some error occurred while creating the Passphrase.'
      });
    });
};
