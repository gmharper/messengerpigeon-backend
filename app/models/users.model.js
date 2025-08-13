const db = require("../../db/connection");

// GET ALL USERS
const queryAllUsers = (sort="followers_count", order="DESC", page=0, limit=20, only="") => {
  const Sorts = [
    "username", "name", "email", "description",
    "profile_colour",
    "created_at",
    "articles_count", "comments_count", "subscribed_topics_count",
    "followers_count", "following_count",
    "voted_articles_count", "voted_comments_count"
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

  let queryString = "SELECT * FROM users"

  switch (sort) {
    case "articles_count":
      queryString += ` ORDER BY cardinality(articles) ${order}`
      break;
    case "comments_count":
      queryString += ` ORDER BY cardinality(comments) ${order}`
      break;
    case "subscribed_topics_count":
      queryString += ` ORDER BY cardinality(subscribed_topics) ${order}`
      break;
    case "followers_count":
      queryString += ` ORDER BY cardinality(followers) ${order}`
      break;
    case "following_count":
      queryString += ` ORDER BY cardinality(following) ${order}`
      break;
    case "voted_articles_count":
      queryString += ` ORDER BY cardinality(voted_articles) ${order}`
      break;
    case "voted_comments_count":
      queryString += ` ORDER BY cardinality(voted_comments) ${order}`
      break;
    default:
      queryString += ` ORDER BY ${sort} ${order}`
  }

  queryString += ` OFFSET ${page*limit} LIMIT ${limit};`

  return db
    .query(queryString)
    .then((result) => {
      return result.rows;
    });
};


const queryUsersData = (dataType) => {
  const dataTypes = [
    "username", "name", "email",
    "description",
    "profile_colour", "avatar_img_url", "banner_img_url",
    "articles", "comments", "subscribed_topics",
    "followers", "following",
    "voted_articles", "voted_comments",
    "created_at",
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, msg: "400: Invalid dataType" })

  let queryString = `SELECT username, ${dataType} FROM users`

  return db
    .query(queryString)
    .then((result) => {
      return result.rows
    })
}

// GET USER BY USERNAME
const queryUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      return result.rows[0]
    })
}

// GET SPECIFIC USER INFO
const queryUserData = (username, dataType) => {
  const dataTypes = [
    "username", "name", "email", "description",
    "profile_colour", "avatar_img_url", "banner_img_url", "banner_blend", "banner_position",
    "articles", "comments", "subscribed_topics",
    "followers", "following", "voted_articles", "voted_comments",
    "created_at"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, msg: "400: Invalid dataType" })

  let queryString = `SELECT ${dataType} FROM users ` +"WHERE username = $1"

  return db
    .query(queryString, [username])
    .then((result) => {
      return result.rows[0]
    })
}

/////////////////////////
const queryUserDataCount = (username, countType) => {
  const countTypes = [
    "articles_count", "comments_count",
    "subscribed_topics_count",
    "followers_count", "following_count",
    "voted_articles_count", "voted_comments_count"
  ]

  if (countType && !countTypes.includes(countType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid countType" });
  }

  let dataType = ""
  switch (countType) {
    case "articles_count":
      dataType = "articles"
      break;
    case "comments_count":
      dataType = "comments"
      break;
    case "subscribed_topics_count":
      dataType = "subscribed_topics"
      break;
    case "followers_count":
      dataType = "followers"
      break;
    case "following_count":
      dataType = "following"
      break;
    case "voted_articles_count":
      dataType = "voted_articles"
      break;
    case "voted_comments_count":
      dataType = "voted_comments"
      break;
  }

  let queryString = `SELECT cardinality(${dataType}) FROM users ` +"WHERE username = $1;"

  return db
    .query(queryString, [username])
    .then((result) => {
      return result.rows[0]
    })
}


// CREATE NEW USER
const insertIntoUsers = (user) => {
  //destructure user
  const { 
    username, name, email, description, 
    profile_colour, avatar_img_url, banner_img_url, banner_blend, banner_position,
    comments, articles, subscribed_topics,
    followers, following,
    voted_articles, voted_comments
   } = user 

  return db
    .query(
      "INSERT INTO users (username, name, email, description, " +
      "profile_colour, avatar_img_url, banner_img_url, banner_blend, banner_position, " + 
      "comments, articles, subscribed_topics, " +
      "followers, following, voted_articles, voted_comments) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;",
      [
        username, name, email, description, 
        profile_colour, avatar_img_url, 
        banner_img_url, banner_blend, banner_position,
        comments, articles, subscribed_topics,
        followers, following,
        voted_articles, voted_comments
      ]
    )
    .then((result) => {
      return result.rows[0];
    });
};


// PATCH USER
const updateUser = (username, user) => {
  // destructure user
  const { 
    name, email, description, 
    profile_colour, avatar_img_url, banner_img_url, banner_blend, banner_position,
    comments, articles, subscribed_topics,
    followers, following,
    voted_articles, voted_comments
   } = user 

  return db
    .query(
      "UPDATE users SET name=$2, email=$3, description=$4, " +
      "profile_colour=$5, avatar_img_url=$6, banner_img_url=$7, banner_blend=$8, banner_position=$9, " +
      "comments=$10, articles=$11, subscribed_topics=$12, " +
      "followers=$13, following=$14, voted_articles=$15, voted_comments=$16 " +
      "WHERE username = $1 RETURNING *;", 
      [
        username, name, email, description,
        profile_colour, avatar_img_url, banner_img_url, banner_blend, banner_position,
        comments, articles, subscribed_topics,
        followers, following,
        voted_articles, voted_comments
      ]
    )
    .then((result) => {
      return result.rows[0]
    })
};

//////////////////////
const updateUserData = (username, dataType, data) => {
  const dataTypes = [
    "name", "email", "description",
    "profile_colour", "avatar_img_url", "banner_img_url", "banner_blend", "banner_position",
    "articles", "comments", "subscribed_topics",
    "followers", "following",
    "voted_articles", "voted_comments"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, err_msg: "Invalid dataType" })

  let queryString = `UPDATE users SET ${dataType}=$2` +" WHERE username = $1 RETURNING *;"

  return db
    .query(queryString, [username, data])
    .then((result) => {
      return result.rows[0]
    })
}
  


// DELETE USER
const deleteFromUsers = (username, dummy) => {
  if (dummy) {
    return db
      .query("SELECT FROM users WHERE username = $1 RETURNING *", [username])
      .then((result) => {
        return result.rows[0]
      })
  }

  return db
    .query("DELETE FROM users WHERE username = $1 RETURNING *;", [username])
    .then((result) => {
      return result.rows[0]
    })
};


module.exports = {
  queryAllUsers, queryUsersData,
  queryUserByUsername, queryUserData, queryUserDataCount,
  insertIntoUsers,
  updateUser, updateUserData,
  deleteFromUsers,
};
