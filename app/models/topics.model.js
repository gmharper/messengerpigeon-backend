const db = require("../../db/connection");

const queryAllTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

const insertTopic = (slug, description) => {
  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const deleteFromTopics = (topic_id) => {
  return db.query("DELETE FROM topics WHERE topic_id = $1;", [topic_id]);
};

module.exports = {
  queryAllTopics,
  insertTopic,
  deleteFromTopics,
};
