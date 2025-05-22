const { queryAllUsers, queryUserByName } = require("../models/users.model");

const getUsers = (req, res, next) => {
  return queryAllUsers().then((users) => {
    return res.status(200).send({ users: users });
  });
};

const getUser = (req, res, next) => {
  return queryUserByName().then((user) => {
    return res.status(200).send( { user: user })
  })
}

module.exports = {
  getUsers,
  getUser
};
