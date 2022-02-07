const bcrypt = require('bcrypt');
const db = require('../models');

const User = db.participants;
const UserLink = db.trainedby;
const Trainers = db.trainers;
const Admins = db.admins;
const Organisation = db.organisations;
const Types = db.types;

// Login user
exports.logIn = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.type || !req.body.password) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  function startSession(id) {
    if (id !== 0) {
      req.session.userId = id;
      req.session.type = req.body.type;
      res.send(true);
    } else {
      res.status(500).send({
        message: 'id is not found'
      });
    }
  }

  const { username } = req.body;
  const { password } = req.body;

  if (req.body.type === 'participant') {
    User.findOne({
      attributes: ['id', 'password'],
      where: {
        username
      }
    })
      .then((data) => {
        const validate = (data ? bcrypt.compareSync(password, data.password) : false);
        if (validate) {
          startSession(data.id);
        } else {
          res.status(400).send({
            message: 'A user with this username/password combination does not exist.'
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Error retrieving User with username=${username}`
        });
      });
  } else if (req.body.type === 'trainer') {
    Trainers.findOne({
      attributes: ['id', 'password'],
      where: {
        username
      }
    })
      .then((data) => {
        const validate = (data ? bcrypt.compareSync(password, data.password) : false);
        if (validate) {
          startSession(data.id);
        } else {
          res.status(400).send({
            message: 'A trainer with this username/password combination does not exist.'
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
                err.message || `Error retrieving Trainer with username=${username}`
        });
      });
  } else if (req.body.type === 'admin') {
    Admins.findOne({
      attributes: ['id', 'password'],
      where: {
        username
      }
    })
      .then((data) => {
        const validate = (data ? bcrypt.compareSync(password, data.password) : false);
        if (validate) {
          startSession(data.id);
        } else {
          res.status(400).send({
            message: 'An admin with this username/password combination does not exist.'
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Error retrieving Admin with username=${username}`
        });
      });
  } else {
    res.status(500).send({
      message: `Error with Type, not valid with type=${req.body.type}`
    });
  }
};

exports.getInfo = (req, res) => {
  const { userId, type } = req.session;

  function getUserData(id) {
    const userData = User.findByPk(id);
    return userData;
  }

  function getUserLink(id) {
    const userLink = UserLink.findOne({
      where: {
        participantId: id
      }
    });

    return userLink;
  }

  function getTrainerData(trainerId) {
    const trainerData = Trainers.findByPk(trainerId);
    return trainerData;
  }

  function getOrgData(organisationId) {
    const orgData = Organisation.findByPk(organisationId);
    return orgData;
  }

  function getTypeData(typeId) {
    const typeData = Types.findOne({
      attributes: ['name'],
      where: {
        id: typeId
      }
    });

    return typeData;
  }

  async function getParticipant(id) {
    try {
      const userData = await getUserData(id);
      if (!userData) {
        res.status(400).send({
          message: 'A user with this id does not exist.'
        });
        return;
      }

      const userLink = await getUserLink(id);
      if (!userLink) {
        const indivTypeData = await getTypeData(1);

        res.json({
          type,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          trainerFirstName: null,
          trainerLastName: null,
          trainerUsername: null,
          organisationId: null,
          organisationName: '',
          organisationTypeName: indivTypeData.name
        });
        return;
      }

      const trainerData = await getTrainerData(userLink.trainerId);
      if (!trainerData) {
        res.status(400).send({
          message: 'A trainer with this id does not exist.'
        });
        return;
      }

      const orgData = await getOrgData(trainerData.organisationId);
      if (!orgData) {
        res.status(400).send({
          message: 'An organisation with this id does not exist.'
        });
        return;
      }

      const typeData = await getTypeData(orgData.typeId);
      if (!typeData) {
        res.status(400).send({
          message: 'A type with this id does not exist.'
        });
        return;
      }

      res.json({
        type,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        trainerFirstName: trainerData.firstName,
        trainerLastName: trainerData.lastName,
        trainerUsername: trainerData.username,
        organisationId: trainerData.organisationId,
        organisationName: orgData.name,
        organisationTypeName: typeData.name
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || `Error retrieving data for user with id=${id}`
      });
    }
  }

  async function getTrainer(id) {
    try {
      const trainerData = await getTrainerData(id);
      if (!trainerData) {
        res.status(400).send({
          message: 'A trainer with this id does not exist.'
        });
        return;
      }
      console.log(trainerData);

      const orgData = await getOrgData(trainerData.organisationId);
      if (!orgData) {
        res.status(400).send({
          message: 'An organisation with this id does not exist.'
        });
        return;
      }
      console.log(orgData);

      const typeData = await getTypeData(orgData.typeId);
      if (!typeData) {
        res.status(400).send({
          message: 'A type with this id does not exist.'
        });
        return;
      }

      res.json({
        type,
        username: trainerData.username,
        firstName: trainerData.firstName,
        lastName: trainerData.lastName,
        canManage: trainerData.canManage,
        organisationId: orgData.id,
        organisationName: orgData.name,
        organisationTypeName: typeData.name
      });
    } catch (err) {
      res.status(500).send({
        message:
            err.message || `Error retrieving data for trainer with id=${id}`
      });
    }
  }

  function getAdmin(id) {
    Admins.findByPk(id)
      .then((data) => {
        res.json({
          type,
          username: data.username
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Error retrieving Admin with id=${id}`
        });
      });
  }

  // Make an API request internally?
  if (type === 'participant') {
    getParticipant(userId);
  } else if (type === 'trainer') {
    getTrainer(userId);
  } else if (type === 'admin') {
    getAdmin(userId);
  } else {
    res.json({
      type,
      username: null,
      firstName: null,
      lastName: null,
      trainerFirstName: null,
      trainerLastName: null,
      trainerUsername: null,
      organisationId: null,
      organisationName: ''
    });
  }
};

// ToDo This is really ugly
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({
        message:
            err.message || 'Error closing the session'
      });
    } else {
      res.redirect('/');
    }
  });
};
