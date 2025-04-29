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
const queryArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

const queryCommentsByArticle = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

const queryCommentCount = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 ", [article_id])
    .then((result) => {
      return result.rows.length;
    });
};

const insertCommentIntoArticle = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3)",
      [article_id, body, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

// comment_id SERIAL PRIMARY KEY,
//         article_id INT REFERENCES articles(article_id),
//         article_title VARCHAR,
//         body TEXT,
//         votes INT DEFAULT 0,
//         author VARCHAR REFERENCES users(username),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

module.exports = {
  queryTopics,
  queryArticles,
  queryArticleById,
  queryCommentsByArticle,
  queryCommentCount,
  insertCommentIntoArticle,
};
