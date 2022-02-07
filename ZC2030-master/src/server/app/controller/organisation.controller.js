const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../models');

const Organisation = db.organisations;
const Trainer = db.trainers;
const Type = db.types;
const Category = db.calculatorCategory;
const Input = db.calculatorInput;

// Create and Save a new Organisation
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.firstName || !req.body.lastName
    || !req.body.name || !req.body.password || !req.body.type) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  function startSession(id) {
    req.session.userId = id;
    req.session.type = 'trainer';
  }

  function deleteOrganisation(id) {
    Organisation.destroy({
      where: { id }
    })
      .then((num) => {
        if (num) {
          res.send({
            message: 'Organisation was deleted successfully!'
          });
        } else {
          res.send({
            message: `Cannot delete Organisation with id=${id}. Maybe Organisation was not found!`
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Could not delete Organisation with id=${id}`
        });
      });
  }

  function createTrainer(organisationId) {
    const trainer = {
      organisationId,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      canManage: true
    };

    // Save Trainer in the database
    const data = Trainer.create(trainer);

    return data;
  }

  function createOrganisation() {
    // Create a Organisation
    const organisation = {
      name: req.body.name,
      typeId: req.body.type
    };

    let data = null;

    // Save Organisation in the database
    data = Organisation.create(organisation);

    return data;
  }

  async function main() {
    try {
      let orgData = null;

      try {
        orgData = await createOrganisation();
      } catch (err) {
        if (err.message === 'Validation error') {
          res.status(409).send({
            message: 'That organisation name already exists.'
          });
        } else {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the Organisation.'
          });
        }
        return;
      }

      if (!orgData) {
        res.status(400).send({
          message: `Cannot create organisation with name=${req.body.name}`
        });
        return;
      }

      let trainerData = null;

      try {
        trainerData = await createTrainer(orgData.id);
      } catch (err) {
        if (err.message === 'Validation error') {
          res.status(409).send({
            message: 'That trainer username already exists.'
          });
        } else {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the Trainer.'
          });
        }
        deleteOrganisation(orgData.id);
        return;
      }
      if (!orgData) {
        res.status(400).send({
          message: `Cannot create trainer with name=${req.body.username}`
        });
        return;
      }

      startSession(trainerData.id);
      res.status(201).send({
        message: `Organisation ${orgData.name} successfully created with trainer ${req.body.username}`
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Organisation.'
      });
    }
  }

  main();
};

// Gets a list of organisation types
exports.getTypes = (req, res) => {
  let query;

  // Not an admin, hide the Individual type
  if (req.session.type !== 'admin') {
    query = {
      attributes: ['id', 'name'],
      where: { [Op.not]: { name: 'Individual' } }
    };
  } else {
    query = {
      attributes: ['id', 'name']
    };
  }

  Type.findAll(query)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(400).send({
          message: 'There are no organisation types.'
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Error retrieving organisation types.'
      });
    });
};

// Create a new organisation type
exports.newType = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  // Create a type
  const type = {
    name: req.body.name
  };

  // Save Category in the database
  Type.create(type)
    .then((data) => {
      res.json({
        id: data.id
      });
    })
    .catch((err) => {
      if (err.message === 'Validation error') {
        res.status(409).send({
          message: 'That organisation type already exists.'
        });
      } else {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the Type.'
        });
      }
    });
};

exports.deleteType = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.type) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  // Prevent deletion of initial type individual
  if (req.body.type === 1) {
    res.status(400).send({
      message: 'You cannot delete the individual type.'
    });
    return;
  }

  function checkUnused(typeId) {
    const count = Organisation.count({
      where: { typeId },
      distinct: true,
      col: 'id'
    });

    return count;
  }

  async function getAllRelatedCategories(typeId) {
    return Category.findAll({
      attributes: ['id'],
      where: { typeId }
    });
  }

  async function deleteAllRelatedInputs(categoryId) {
    await Input.destroy({
      where: { categoryId }
    })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Could not delete Input with categoryId=${categoryId}`
        });
      });
  }
  async function deleteCategory(id) {
    await Category.destroy({
      where: { id }
    })
      .then((num) => {
        if (!num) {
          res.send({
            message: `Cannot delete Category with id=${id}.`
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Could not delete Category with id=${id}`
        });
      });
  }

  async function deleteType(id) {
    await Type.destroy({
      where: { id }
    })
      .then((num) => {
        if (num) {
          res.send({
            message: 'Type was deleted successfully!'
          });
        } else {
          res.send({
            message: `Cannot delete Type with id=${req.body.type}.`
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || `Could not delete Type with id=${req.body.type}`
        });
      });
  }

  async function main() {
    const { type } = req.body;
    let i;

    try {
      // Check if currently used by organisations
      if (await checkUnused(type) > 0) {
        res.status(500).send({
          message: 'This type is currently used by active organisations, so cannot be deleted'
        });
        return;
      }

      const allCategories = await getAllRelatedCategories(type);
      for (i = 0; i < allCategories.length; i += 1) {
        deleteAllRelatedInputs(allCategories[i].id);
        deleteCategory(allCategories[i].id);
      }

      await deleteType(type);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while deleting the Category.'
      });
    }
  }

  main();
};
