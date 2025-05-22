const db = require("../../db/connection");

const queryAllUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

const queryUserByName = (username) => {
  return db.query("SELECT * FROM users WHERE username = $1", [username])
  .then((result) => {
    return result.rows[0]
  })
}

module.exports = {
  queryAllUsers,
  queryUserByName,
};
