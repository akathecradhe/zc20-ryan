const bcrypt = require('bcrypt');
const db = require('../models');

const User = db.participants;
const Passphrase = db.passphrase;
const TrainedBy = db.trainedby;

// Create and save a new participant
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.password) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }


  function startSession(id) {
    if (id !== 0) {
      req.session.userId = id;
      req.session.type = 'participant';
      res.send(true);
    }
  }

  // Create a participant
  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  // Save participant in the database
  User.create(user)
    .then((data) => {
      startSession(data.id);
      res.status(201).send({
        message: `User ${data.username} successfully created`
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
};

// Update a participant by the id in the request
exports.update = (req, res) => {
  const id = req.session.userId;

  if (req.session.type !== 'participant') {
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

  // Create an updated participant
  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  User.update(user, {
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Participant was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Participant with id=${id}. Maybe Participant was not found or session is empty!`
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
              err.message || `Error updating Participant with id=${id}`
        });
      }
    });
};

// Link a participant to a trainer
exports.linkPass = (req, res) => {
  if (req.session.type !== 'participant') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Find the accompanying trainer ID
  Passphrase.findOne({
    attributes: ['trainerId'],
    where: {
      passphrase: req.body.passphrase
    }
  })
    .then((data) => {
      if (data) {
        TrainedBy.create({
          participantId: req.session.userId,
          trainerId: data.trainerId
        });
        res.json({ trainerid: data.trainerId });
      } else {
        res.status(400).send({
          message: 'This passphrase does not exist.'
        });
      }
    });
};
