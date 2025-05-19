const db = require("../../db/connection");

const queryAllUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

module.exports = {
  queryAllUsers,
};
