const db = require("../../db/connection");

// GET ALL COMMENTS
const queryAllComments = (username="", article_id="", sort="", order='DESC', page=0, limit=20, only='' ) => {
  const Sorts = [
    "article_id",
    "author",
    "body",
    "created_at",
    "votes_count"
  ];
  const Orders = ["ASC", "DESC"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (typeof Number(page) != "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page" });
  }
  if (typeof Number(limit) != "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page Limit" });
  }

  let queryString = "SELECT * FROM comments"
  let queryArray = []

  if (sort==="votes_count") queryString += ` ORDER BY cardinality(voted_by) ${order}`
  else if (sort) queryString += ` ORDER BY ${sort} ${order}`

  queryString += ` OFFSET ${page*limit} LIMIT ${limit}`

  if (username && article_id) {
    queryString += " WHERE username=$1 AND article_id=$2;"
    queryArray = [username, article_id]
  }
  else if (username) {
    queryString += " WHERE username=$1;"
    queryArray = [username]
  }
  else if (article_id) {
    queryString += " WHERE article_id=$1;"
    queryArray = [article_id]
  }

  return db
    .query(queryString, queryArray)
    .then((result) => {
      return result.rows;
    });
};

/////////////////
const queryCommentsData = (dataType) => {
  const dataTypes = [
    "comment_id","article_id","article_title","author","body","voted_by","created_at"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, msg: "400: Invalid dataType" })

  let queryString = `SELECT comment_id, article_id, ${dataType} FROM comments`

  return db
    .query(queryString)
    .then((result) => {
      return result.rows
    })
}


// GET SPECIFIC COMMENT
const queryCommentById = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      return result.rows[0];
    })
};

const queryCommentData = (comment_id, dataType) => {
  const dataTypes = [
    "comment_id","article_id","article_title","author","body","voted_by","created_at"
  ]

  if (dataType && !dataTypes.includes(dataType)) return Promise.reject({ status: 400, msg: "400: Invalid dataType" })

  let queryString = `SELECT ${dataType} FROM comments ` +"WHERE comment_id = $1"

  return db
    .query(queryString, [comment_id])
    .then((result) => {
      return result.rows[0]
    })
}

const queryCommentDataCount = (comment_id, countType) => {
  const countTypes = [
    "votes_count",
  ]

  if (!countTypes.includes(countType)) return Promise.reject({ status: 400, msg: "400: Invalid countType" })

  let dataType = ""
  switch (countType) {
    case "votes_count":
      dataType = "voted_by"
      break;
  }

  let queryString = `SELECT cardinality(${dataType}) FROM comments ` +"WHERE comment_id = $1"

  return db
    .query(queryString, [comment_id])
    .then((result) => {
      return result.rows[0]
    })
}


// POST COMMENT
const insertIntoComments = (comment) => {
  // destructure comment
  const { article_id, article_title, author, body, created_at } = comment

  return db
    .query(
      "INSERT INTO comments (article_id, article_title, author, body, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [article_id, article_title, author, body, created_at]
    )
    .then((result) => {
      console.log(result.rows)
      return result.rows[0];
    });
};


// PATCH COMMENT
const updateComment = (comment_id, comment) => {
  // destructure comment
  const { author, body } = comment

  return db
    .query("UPDATE comments SET author=$2, body=$3 WHERE comment_id = $1 RETURNING *;", [comment_id, author, body])
    .then((result) => {
      return result.rows[0]
    })
}

////////////////////////
const updateCommentData = (comment_id, dataType, data) => {
  const dataTypes = [
    "author", "body", "img_url",
    "voted_by"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, err_msg: "Invalid dataType" })

  let queryString = `UPDATE comments SET ${dataType}=$2` +" WHERE comment_id = $1 RETURNING *;"

  return db
    .query(queryString, [comment_id, data])
    .then((result) => {
      return result.rows[0]
    })
}


// DELETE COMMENT
// need to delete from comments, article AND user
const deleteFromComments = (comment_id, dummy) => {
  if (dummy) {
    return db
      .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
      .then((result) => {
        return result.rows[0]
      })
  }

  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id,])
    .then((result) => {
      return result.rows[0]})
};


module.exports = {
  queryAllComments, queryCommentsData,
  queryCommentData, queryCommentDataCount,
  queryCommentById,
  insertIntoComments,
  updateComment, updateCommentData,
  deleteFromComments,
};
