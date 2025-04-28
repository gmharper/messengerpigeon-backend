const db = require("../../db/connection");

const queryTopics = () => {
  return db.query("SELECT * FROM topics");
};

module.exports = queryTopics;
