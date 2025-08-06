const db = require("../../db/connection");

// GET ALL COMMENTS
const queryAllComments = (sort='votes', order='DESC', page=0, limit=20, only) => {
  return db
    .query(
      "SELECT * FROM comments ORDER BY $1 $2 OFFSET $3 LIMIT $4",
      [sort, order, page, limit]
    )
    .then((result) => {
      return result.rows;
    });
};


// GET SPECIFIC COMMENT
const queryCommentById = (comment_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE comment_id = $1", [comment_id]
    )
    .then((result) => {
      return result.rows;
    })
};

const queryCommentInfo = (comment_id, infoType) => {
  return db
    .query(
      "SELECT $2 FROM comments WHERE comment_id = $1", [comment_id, infoType]
    )
    .then((result) => {
      return result.rows
    })
}

const queryCommentInfoCount = () => {}


// GET ALL COMMENTS FROM ARTICLE
const queryCommentsByArticle = (article_id, sort='created_at', order='DESC', page=0, limit=20, only='') => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY $2 $3 OFFSET $4 LIMIT $5;",
      [article_id, sort, order, page, limit]
    )
    .then((result) => {
      return result.rows;
    });
};

const queryCommentsByUser = (username, sort='created_at', order='DESC', page=0, limit=20, only='') => {
  return db
    .query(
      "SELECT * FROM comments WHERE author = $1 ORDER BY $2 $3 OFFSET $4 LIMIT $5;", 
      [username, sort, order, page, limit]
    )
    .then((result) => {
      return result.rows
    })
}


// POST COMMENT
const insertIntoComments = (comment) => {
  // destructure comment
  const { article_id, author, body} = comment

  return db
    .query(
      "INSERT INTO comments (article_id, author, body) "+ 
      "VALUES ($1, $2, $3) RETURNING *",
      [article_id, author, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};


// PATCH COMMENT
const patchComment = (comment_id, comment) => {
  // destructure comment
  const {} = comment

  return db
    .query(
      "UPDATE comments SET author=$2 WHERE comment_id = $1"
      [comment_id]
    )
}

const patchCommentVotes = (comment_id, votes) => {
  return db
    .query(
      "UPDATE comments SET votes=votes+$2 WHERE comment_id = $1",
      [comment_id, votes]
    )
}


// DELETE COMMENT
// need to delete from comments, article AND user
const deleteFromComments = (comment_id) => {
  return db
  .query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *", [comment_id,])
  .then((result) => {
    return result.rows[0]})
};


module.exports = {
  queryAllComments, queryCommentInfo,
  queryCommentById, queryCommentsByArticle, queryCommentsByUser,
  insertIntoComments,
  patchComment, patchCommentVotes,
  deleteFromComments,
};
