const db = require("../../db/connection");

// GET ALL ARTICLES
const queryAllArticles = (topic="", author="", sort="created_at", order="DESC", page=0, limit=20) => {
  const Sorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes_count",
  ];
  const Orders = ["ASC", "DESC"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (typeof Number(page) !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page" });
  }
  if (typeof Number(limit) !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page Limit" });
  }

  let queryString = "SELECT * FROM articles"
  let queryArray = []

  if (topic && author) {
    queryString += " WHERE topic=$1 AND author=$2" 
    queryArray = [topic, author]
  }
  else if (topic) { 
    queryString += " WHERE topic=$1"
    queryArray = [topic]
  }
  else if (author) { 
    queryString += " WHERE author=$1" 
    queryArray = [author]
  }

  if (sort==="votes_count") queryString += ` ORDER BY cardinality(voted_by) ${order}`
  else queryString += ` ORDER BY ${sort} ${order}`

  queryString += ` OFFSET ${page*limit} LIMIT ${limit};`


  return db.query(queryString, queryArray)
    .then((result) => {
      return result.rows;
    });
};


/////////////////////
const queryArticlesData = (dataType) => {
  const dataTypes = [
    "article_id","title","topic","author","body","comments","voted_by","img_url","created_at"
  ]

  if (!dataTypes.includes(dataType)) { return Promise.reject({ status: 400, msg: "Invalid dataType" })}

  let queryString = `SELECT article_id, title, ${dataType} FROM articles`

  return db
    .query(queryString)
    .then((result) => {
      return result.rows
    })
}


// GET SPECIFIC ARTICLE
const queryArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};


/////////////////
const queryArticleData = (article_id, dataType) => {
  const dataTypes = [
    "article_id","title","topic","author","body","comments","voted_by","img_url","created_at"
  ]

  if (dataType && !dataTypes.includes(dataType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid dataType" });
  }

  let queryString = `SELECT ${dataType} FROM articles ` +"WHERE article_id = $1"

  return db
    .query(queryString, [article_id])
    .then((result) => {
      return result.rows[0]
    })
}


const queryArticleDataCount = (article_id, countType) => {
  const countTypes = [
    "comments_count",
    "votes_count",
  ]

  if (countType && !countTypes.includes(countType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid countType" });
  }

  let dataType = ""
  switch (countType) {
    case "comments_count":
      dataType = "comments"
      break;
    case "votes_count":
      dataType = "voted_by"
      break;
  }

  let queryString = `SELECT cardinality(${dataType}) FROM articles ` +"WHERE article_id = $1"

  return db
    .query(queryString, [article_id])
    .then((result) => {
      return result.rows[0]
    })
}


// CREATE ARTICLE
// "INSERT INTO articles(title, topic, author, body, img_url, created_at) VALUES %L RETURNING *"
const insertIntoArticles = (article) => {
  // Destructure article
  const { title, topic, author, body, img_url, created_at } = article

  return db
    .query(
      "INSERT INTO articles (title, topic, author, body, img_url, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;", 
      [title, topic, author, body, img_url, created_at]
    )
    .then((result) => {
      return result.rows[0]
    })
}


// PATCH ARTICLE
const updateArticle = (article_id, article) => {
  // Destructure article
  const {
    title, topic, author, body, img_url
  } = article

  return db
    .query(
      "UPDATE articles SET title=$2, topic=$3, author=$4, body=$5, img_url=$6 WHERE article_id = $1 RETURNING *;", 
      [article_id, title, topic, author, body, img_url]
    )
    .then((result) => {
      return result.rows[0]
    })
}

////////////////////////
const updateArticleData = (article_id, dataType, data) => {
  const dataTypes = [
    "title", "topic", "author", "body", "img_url",
    "voted_by", "comments"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, err_msg: "Invalid dataType" })

  let queryString = `UPDATE articles SET ${dataType}=$2` +" WHERE article_id = $1 RETURNING *;"

  return db
    .query(queryString, [article_id, data])
    .then((result) => {
      return result.rows[0]
    })
}



// DELETE ARTICLE
const deleteFromArticles = (article_id) => {
  return db.query("DELETE FROM articles WHERE article_id = $1 RETURNING *", [
    article_id,
  ])
  .then((result) => {
    return result.rows[0]
  })
};


module.exports = {
  queryAllArticles, queryArticlesData,
  queryArticleById, queryArticleData, queryArticleDataCount,
  insertIntoArticles,
  updateArticle, updateArticleData,
  deleteFromArticles,
};
