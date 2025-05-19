const db = require("../../db/connection");

const queryAllComments = () => {
  let queryString = `SELECT * FROM comments;`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

const queryCommentById = () => {
  return;
};

const queryCommentsByArticle = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
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

const insertComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    });
};

const deleteFromComments = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
    comment_id,
  ]);
};

module.exports = {
  queryAllComments,
  queryCommentById,
  queryCommentsByArticle,
  queryCommentCount,
  insertComment,
  deleteFromComments,
};
