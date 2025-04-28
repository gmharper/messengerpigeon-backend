const db = require("../../db/connection");

const queryTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

const queryArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { queryTopics, queryArticleById };
