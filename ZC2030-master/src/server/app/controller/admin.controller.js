const bcrypt = require('bcrypt');
const db = require('../models');

const Admin = db.admins;

// Create and Save a new Admin
exports.create = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  // Create an Admin
  const admin = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  };

  // Save Admin in the database
  Admin.create(admin)
    .then((data) => {
      res.status(201).send({
        message: `Admin ${data.username} successfully created`
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
              err.message || 'Some error occurred while creating the Admin.'
        });
      }
    });
};

// Update a Admin by the id in the session
exports.update = (req, res) => {
  const id = req.session.userId;

  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  // Create an updated participant
  const admin = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  };

  Admin.update(admin, {
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Admin was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Admin with id=${id}`
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
              err.message || `Error updating Admin with id=${id}`
        });
      }
    });
};

// Delete a Admin with the specified id in the request
exports.delete = (req, res) => {
  const id = req.session.userId;

  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  Admin.destroy({
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Admin was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Admin with id=${id}.`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || `Could not delete Admin with id=${id}`
      });
    });
};
