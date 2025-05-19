const { queryAllUsers } = require("../models/users.model");

const getUsers = (req, res, next) => {
  return queryAllUsers().then((users) => {
    return res.status(200).send({ users: users });
  });
};

module.exports = {
  getUsers,
};
