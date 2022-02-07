/* eslint-disable no-await-in-loop */
const { Op } = require('sequelize');
const db = require('../models');

const Category = db.calculatorCategory;
const Input = db.calculatorInput;
const Result = db.calculatorResult;
const TrainedBy = db.trainedby;
const Trainer = db.trainers;
const Organisation = db.organisations;
const Types = db.types;

async function getTypeId(userId) {
  if (!userId) {
    return 1;
  }
  const userLink = await TrainedBy.findOne({
    where: {
      participantId: userId
    }
  });
  if (!userLink) {
    return 1;
  }


  const trainerData = await Trainer.findByPk(userLink.trainerId);
  const orgData = await Organisation.findByPk(trainerData.organisationId);
  const typeData = await Types.findOne({
    attributes: ['id'],
    where: {
      id: orgData.typeId
    }
  });

  return typeData.id;
}

// Create a calculator input, with category, name, factor and unit
exports.newInput = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.categoryId || !req.body.name
    || !req.body.factor || !req.body.unit) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  // Create an Input
  const input = {
    categoryId: req.body.categoryId,
    name: req.body.name,
    factor: req.body.factor,
    unit: req.body.unit
  };

  // Save Input in the database
  Input.create(input)
    .then((data) => {
      res.status(201).send({
        message: `Input ${data.name} successfully created`
      });
    })
    .catch((err) => {
      if (err.message === 'Validation error') {
        res.status(409).send({
          message: 'That input name already exists.'
        });
      } else {
        res.status(500).send({
          message:
              err.message || 'Some error occurred while creating the User.'
        });
      }
    });
};

// Update an Input by the id in the session
exports.updateInput = (req, res) => {
  const { id } = req.body;

  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  Input.update(req.body, {
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Input was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Input with id=${id}`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || `Error updating Input with id=${id}`
      });
    });
};

// Delete an Input with the specified id in the request
exports.deleteInput = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.id) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  const { id } = req.body;

  Input.destroy({
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Input was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Input with id=${id}.`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || `Could not delete Input with id=${id}`
      });
    });
};

// Return all input data from category
exports.getCategoryInputs = (req, res) => {
  // Validate request
  if (!req.body.categoryId) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  Input.findAll({
    attributes: ['id', 'name', 'factor', 'unit'],
    where: {
      categoryId: req.body.categoryId
    }
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(400).send({
          message: 'There are no inputs.'
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Error retrieving Inputs'
      });
    });
};

// Return all category info
exports.categories = (req, res) => {
  function getCategories(typeId) {
    Category.findAll({
      attributes: ['id', 'name'],
      where: { typeId }
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(400).send({
            message: 'There are no categories.'
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Error retrieving Categories'
        });
      });
  }

  async function main() {
    if (req.session.type) {
      const typeId = await getTypeId(req.session.userId);
      getCategories(typeId);
    } else {
      getCategories(1);
    }
  }

  main();
};

// Return all category info, given a typeId, admin only
exports.categoriesFromTypeId = (req, res) => {
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

  Category.findAll({
    attributes: ['id', 'name'],
    where: { typeId: req.body.type }
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(400).send({
          message: 'There are no categories.'
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Error retrieving Categories'
      });
    });
};

// Create a category with given name
exports.newCategory = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.name || !req.body.type) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  function checkUnique(name, typeId) {
    const count = Category.count({
      where: {
        name,
        typeId
      },
      distinct: true,
      col: 'id'
    });

    return count;
  }

  function createCategory(category) {
    // Save Category in the database
    Category.create(category)
      .then((data) => {
        res.json({
          id: data.id
        });
      })
      .catch((err) => {
        if (err.message === 'Validation error') {
          res.status(409).send({
            message: 'That category name already exists.'
          });
        } else {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the User.'
          });
        }
      });
  }

  async function main() {
    // Create an Input
    const category = {
      name: req.body.name,
      typeId: req.body.type
    };

    try {
      const count = await checkUnique(category.name, category.typeId);
      if (count !== 0) {
        res.status(500).send({
          message: `${category.name} already exists for this type`
        });
        return;
      }

      createCategory(category);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Category.'
      });
    }
  }

  main();
};

// Update a Category by the id in the session
exports.updateCategory = (req, res) => {
  const { id } = req.body;

  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  Category.update(req.body, {
    where: { id }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Category was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Category with id=${id}`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || `Error updating Category with id=${id}`
      });
    });
};

// Delete a Category with the specified id in the request
exports.deleteCategory = (req, res) => {
  if (req.session.type !== 'admin') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.id) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  async function deleteAllRelatedInputs(categoryId) {
    await Input.destroy({
      where: { categoryId }
    })
      .then((num) => {
        if (!num) {
          res.send({
            message: `Cannot delete Input with categoryId=${categoryId}.`
          });
        }
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
        if (num) {
          res.send({
            message: 'Category was deleted successfully!'
          });
        } else {
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

  function main() {
    try {
      const { id } = req.body;
      deleteAllRelatedInputs(id);
      deleteCategory(id);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while deleting the Category.'
      });
    }
  }

  main();
};

// Returns the % complete of each category
exports.getPercent = (req, res) => {
  function getInputs(categoryId) {
    const data = Input.findAll({
      attributes: ['id'],
      where: {
        categoryId
      },
      raw: true
    });

    if (!data) {
      res.status(400).send({
        message: `No fields were found for categoryId=${categoryId}`
      });
    }

    return data;
  }

  function inTime(time) {
    const unixTime = Date.parse(time) / 1000;
    const setTime = 24 * 60 * 60 * 1000; // 24H time check (H * M * S * MS)
    const setTimeAgo = Date.now() - setTime;


    if (unixTime < setTimeAgo) {
      return 1;
    }

    return 0;
  }

  function getCompletedInput(inputId, participantId) {
    const data = Result.findAll({
      attributes: ['updatedAt'],
      where: {
        inputId,
        participantId
      },
      raw: true
    });

    if (!data) {
      res.status(400).send({
        message: `No fields were found for inputId=${inputId} & participantId=${participantId}`
      });
    }

    return data;
  }

  async function getCompletedInputs(inputs, participantId) {
    let amount = 0;
    for (let index = 0; index < inputs.length; index += 1) {
      const newInput = await getCompletedInput(inputs[index].id, participantId);
      if (newInput[0]) {
        amount += inTime(newInput[0].updatedAt);
      }
    }

    return amount;
  }

  async function getPercentage(categoryId, id) {
    const inputs = await getInputs(categoryId);
    const completedInputs = await getCompletedInputs(inputs, id);
    const result = parseInt((completedInputs / inputs.length * 100), 10);
    return (result || 0);
  }

  function getCategories(typeId) {
    const data = Category.findAll({
      attributes: ['id', 'name'],
      where: { typeId },
      raw: true
    });

    if (!data) {
      res.status(400).send({
        message: 'No categories were found'
      });
    }

    return data;
  }

  async function main() {
    try {
      const { userId } = req.session;
      const typeId = await getTypeId(userId);
      const categories = await getCategories(typeId);

      const currentValues = [];
      if (req.session.type === 'participant') {
        for (let index = 0; index < categories.length; index += 1) {
          currentValues.push([categories[index].name,
            await getPercentage(categories[index].id, userId)]);
        }
      } else {
        for (let index = 0; index < categories.length; index += 1) {
          currentValues.push([categories[index].name, 0]);
        }
      }

      res.json({ currentValues });
    } catch (err) {
      res.status(500).send({
        message:
        err.message || 'Some error occurred while getting the data.'
      });
    }
  }

  main();
};

exports.getResults = (req, res) => {
  function getUserResults(participantId) {
    const data = Result.findAll({
      attributes: ['id', 'inputId', 'result', 'createdAt'],
      where: { participantId },
      order: [
        ['id', 'DESC'],
      ],
      raw: true
    });

    return data;
  }

  function getInputName(id) {
    const data = Input.findOne({
      attributes: ['name', 'categoryId'],
      where: { id },
      raw: true
    });

    return data;
  }

  function getCategoryName(id) {
    const data = Category.findOne({
      attributes: ['name'],
      where: { id },
      raw: true
    });

    return data;
  }

  async function getNames(results) {
    const inputList = [];

    for (let index = 0; index < results.length; index += 1) {
      const inputData = await getInputName(results[index].inputId);
      const categoryData = await getCategoryName(inputData.categoryId);
      inputList.push([inputData.name, categoryData.name,
        (results[index].result.toFixed(5) / 1), results[index].createdAt, results[index].id]);
    }

    return inputList;
  }

  async function main() {
    try {
      const { userId } = req.session;

      if (userId) {
        const userResults = await getUserResults(userId);
        const results = await getNames(userResults);
        res.json({ results });
      } else {
        res.status(400).send({
          message: 'Not a logged-in user.'
        });
      }
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while getting the Results.'
      });
    }
  }

  main();
};

// Get totals for user, group and organisation
exports.getTotals = (req, res) => {
  async function getOneUserTotal(participantId) {
    const data = await Result.findAll({
      attributes: ['result'],
      where: {
        participantId
      }
    });

    let total = 0;
    data.forEach((element) => {
      total += element.result;
    });

    return total;
  }

  async function getManyUserTotal(userIds) {
    const data = await Result.findAll({
      attributes: ['result'],
      where: {
        participantId: {
          [Op.or]: userIds
        }
      }
    });

    let total = 0;
    data.forEach((element) => {
      total += element.result;
    });

    return total;
  }

  async function getManyTrainerId(organisationId) {
    const data = await Trainer.findAll({
      attributes: ['id'],
      where: { organisationId }
    });

    const group = [];
    data.forEach((element) => {
      group.push(element.id);
    });

    return group;
  }

  async function getOneTrainerId(participantId) {
    const data = await TrainedBy.findOne({
      attributes: ['trainerId'],
      where: { participantId }
    });

    if (!data) {
      return null;
    }

    return data.trainerId;
  }

  async function getOrganisationId(id) {
    const data = await Trainer.findOne({
      attributes: ['organisationId'],
      where: { id }
    });

    return data.organisationId;
  }

  async function getOneGroupIds(trainerId) {
    const data = await TrainedBy.findAll({
      attributes: ['participantId'],
      where: { trainerId }
    });

    const group = [];
    data.forEach((element) => {
      group.push(element.participantId);
    });

    return group;
  }

  async function getManyGroupIds(trainerIds) {
    const data = await TrainedBy.findAll({
      attributes: ['participantId'],
      where: {
        trainerId: {
          [Op.or]: trainerIds
        }
      }
    });

    const group = [];
    data.forEach((element) => {
      group.push(element.participantId);
    });

    return group;
  }

  async function main() {
    try {
      const { userId } = req.session;

      if (!userId) {
        res.status(400).send({
          message: 'Not a logged-in user.'
        });
        return;
      }

      const myTotal = await getOneUserTotal(userId);
      const trainerId = await getOneTrainerId(userId);

      if (!trainerId) {
        res.json({
          myTotal,
          groupTotal: null,
          orgTotal: null
        });

        return;
      }

      const organisationId = await getOrganisationId(trainerId);

      const groupUsers = await getOneGroupIds(trainerId);
      const groupTotal = await getManyUserTotal(groupUsers);

      const orgTrainers = await getManyTrainerId(organisationId);
      const orgUsers = await getManyGroupIds(orgTrainers);
      const orgTotal = await getManyUserTotal(orgUsers);

      res.json({
        myTotal,
        groupTotal,
        orgTotal
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while getting the Totals.'
      });
    }
  }

  main();
};

// Save and calculate user result
exports.newResult = (req, res) => {
  // Validate request
  if (!req.body.inputId || !req.body.amount) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  function getInputData(id) {
    const data = Input.findOne({
      attributes: ['factor'],
      where: { id }
    });

    return data;
  }

  function saveResult(inputId, participantId, quantity, result) {
    // Create a Result
    const newResult = {
      inputId,
      participantId,
      quantity,
      result
    };

    // Save Result in the database
    Result.create(newResult)
      .then((data) => {
        res.status(201).send({
          message: `Result ${data.id} successfully created`
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the Result.'
        });
      });
  }

  async function main(id, amount) {
    try {
      const { factor } = await getInputData(id);
      const result = factor * amount;
      const { userId } = req.session;
      saveResult(id, userId, amount, result);
      res.json({
        result: (result.toFixed(5) / 1)
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Result.'
      });
    }
  }

  main(req.body.inputId, req.body.amount);
};

// Delete a Result with the specified id in the request
exports.deleteResult = (req, res) => {
  if (req.session.type !== 'participant') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  // Validate request
  if (!req.body.id) {
    res.status(400).send({
      message: 'Please submit all fields.'
    });
    return;
  }

  const { id } = req.body;
  const participantId = req.session.userId;

  Result.destroy({
    where: {
      [Op.and]: [
        { id },
        { participantId }
      ]
    }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Result was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Result with id=${id}.`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || `Could not delete Result with id=${id}`
      });
    });
};

// Delete all Results with the specified participantId in the request
exports.deleteAllParticipantResults = (req, res) => {
  if (req.session.type !== 'participant') {
    res.status(403).send({
      message: 'You are not authorised to make such a request.'
    });
    return;
  }

  const participantId = req.session.userId;

  Result.destroy({
    where: { participantId }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'Results were deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Results with participantId=${participantId}.`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || `Could not delete Results with participantId=${participantId}`
      });
    });
};
