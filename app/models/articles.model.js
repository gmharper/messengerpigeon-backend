const db = require("../../db/connection");

// GET ALL ARTICLES
const queryAllArticles = (topic='', username='', sort="created_at", order="DESC", page=0, limit=20) => {
  const Sorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at"
  ];
  const Orders = ["ASC", "DESC"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (typeof page !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page" });
  }
  if (typeof limit !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page Limit" });
  }

  let queryString = `SELECT * FROM articles`
  let queryArray = []

  if (topic && username) { 
    queryString += " WHERE topic=$1 AND username=$2" 
    queryArray = [topic, username]
  }
  else if (topic) { 
    queryString += " WHERE topic=$1"
    queryArray = [topic]
  }
  else if (username) { 
    queryString += " WHERE username=$1" 
    queryArray = [username]
  }

  queryString += ` ORDER BY ${sort} ${order} OFFSET ${page*limit} LIMIT ${limit};`

  return db.query(
    queryString,
  ).then((result) => {
    return result.rows;
  });
};


// GET SPECIFIC ARTICLE
const queryArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};


/////////////////
const queryArticleInfo = (article_id, infoType) => {
  const infoTypes = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "comments",
    "voted_by",
    "img_url",
    "created_at"
  ]

  if (infoType && !infoTypes.includes(infoType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid infoType" });
  }

  let queryString = `SELECT ${infoType} FROM articles ` +"WHERE article_id = $1"

  return db
    .query(queryString, [article_id])
    .then((result) => {
      return result.rows[0]
    })
}


const queryArticleInfoCount = (article_id, infoCountType) => {
  const infoCountTypes = [
    "comment_count",
    "vote_count",
  ]

  if (infoCountType && !infoCountTypes.includes(infoCountType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid infoType" });
  }

  let infoType = ""
  switch (infoCountType) {
    case "comment_count":
      infoType = "comments"
      break;
    case "vote_count":
      infoType = "voted_by"
      break;
  }

  let queryString = `SELECT cardinality(${infoType}) FROM articles ` +"WHERE article_id = $1"

  return db
    .query(queryString, [article_id])
    .then((result) => {
      return result.rows[0]
    })
}


///////////////////
const queryArticlesByUser = (username='', sort = "created_at", order = "DESC", page=0, limit=20, only='') => {
  const Sorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
    "created_at",
  ];
  const Orders = ["ASC", "DESC"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (!username) {
    return Promise.reject({ status: 400, msg: "Invalid Username" });
  }

  return db.query(
    "SELECT * FROM ARTICLES WHERE author=$1 ORDER BY $2 $3 OFFSET $4 LIMIT $5;", 
    [username, sort, order, page, limit])
    .then((result) => {
      return result.rows;
  })
};


////////////////////////
const queryArticlesByTopic = (topic="", sort="created_at", order="DESC", page=0, limit=20, only="") => {
  const Sorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
    "created_at",
  ];
  const Orders = ["ASC", "DESC"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (!topic) {
    return Promise.reject({ status: 400, msg: "Invalid Topic" });
  }

  return db.query(
    "SELECT * FROM ARTICLES WHERE topic=$1 ORDER BY $2 $3 OFFSET $4 LIMIT $5;", 
    [topic, sort, order, page, limit])
    .then((result) => {
      return result.rows;
  })
}


// CREATE ARTICLE
// "INSERT INTO articles(title, topic, author, body, img_url, created_at) VALUES %L RETURNING *"
const insertIntoArticles = (article) => {
  // Destructure article
  const { title, topic, author, body, img_url, created_at } = article

  return db
    .query(() => {
      "INSERT INTO ARTICLES (title, topic, author, body, img_url, created_at) "+
      "VALUES ($1 $2 $3 $4 $5 $6) RETURNING *", 
      [title, topic, author, body, img_url, created_at]
    })
    .then((result) => {
      return result.rows[0]
    })
}


// PATCH ARTICLE
const updateArticle = (article_id, article) => {
  // Destructure article
  const {} = article

  return db
    .query(() => {
      "INSERT INTO ARTICLES () VALUES %L WHERE article_id = $1 RETURNING *", [article_id]
    })
    .then((result) => {
      return result.rows[0]
    })
}

const updateArticleVotes = (article_id, votes) => {
  return db
    .qeury(() => {
      "UPDATE ARTICLES SET votes=$2 WHERE article_id = $1", [article_id, votes]
    })
    .then((result) => {
      return result.rows[0]
    })
}

const updateArticleComments = (article_id, commentsArray) => {
  return db
    .query(() => {
      "UPDATE ARTICLES SET comments=$2 WHERE article_id = $1", [article_id, commentsArray]
    })
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
  queryAllArticles, queryArticleById, queryArticleInfo, queryArticleInfoCount, queryArticlesByUser, queryArticlesByTopic,
  insertIntoArticles,
  updateArticle, updateArticleVotes, updateArticleComments,
  deleteFromArticles,
};
