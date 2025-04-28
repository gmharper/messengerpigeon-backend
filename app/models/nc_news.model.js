const db = require("../../db/connection");

const queryTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

const queryArticles = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC")
    .then((result) => {
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

const queryCommentCount = (id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [id])
    .then((result) => {
      return result.rows.length;
    });
};

module.exports = {
  queryTopics,
  queryArticles,
  queryArticleById,
  queryCommentCount,
};
