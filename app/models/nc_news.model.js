const db = require("../../db/connection");

const queryUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

const queryTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

const queryArticles = (sort = "created_at", order = "DESC", topic) => {
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
  const Topics = ["mitch", "coding", "football", "cooking"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (topic && !Topics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid Topic" });
  }

  let queryStr = `SELECT * FROM articles`;

  if (topic && Topics.includes(topic)) {
    queryStr += ` WHERE topic='${topic}'`;
  }
  if (Sorts.includes(sort) && Orders.includes(order.toUpperCase())) {
    queryStr += ` ORDER BY ${sort} ${order}`;
  }
  return db.query(queryStr).then((result) => {
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
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *",
      [article_id, body, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const updateArticleVotes = (article_id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes=votes+$2 WHERE article_id = $1 RETURNING *",
      [article_id, votes]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const deleteFromComments = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
    comment_id,
  ]);
};

// comment_id SERIAL PRIMARY KEY,
//         article_id INT REFERENCES articles(article_id),
//         article_title VARCHAR,
//         body TEXT,
//         votes INT DEFAULT 0,
//         author VARCHAR REFERENCES users(username),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

module.exports = {
  queryUsers,
  queryTopics,
  queryArticles,
  queryArticleById,
  queryCommentsByArticle,
  queryCommentCount,
  insertCommentIntoArticle,
  updateArticleVotes,
  deleteFromComments,
};
