const db = require("../../db/connection");


// GET ALL USERS
const queryAllUsers = () => {
  return db
    .query("SELECT * FROM users")
    .then((result) => {
      return result.rows;
    });
};

// GET USER BY USERNAME
const queryUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      return result.rows[0]
    })
}

// GET SPECIFIC USER INFO
const queryUserInfo = (username, infoType) => {
  const infoTypes = [
    "username", "name", "email",
    "description",
    "profile_colour", "avatar_img_url", "banner_img_url",
    "articles", "comments", "subscribed_topics",
    "followers", "following",
    "voted_articles", "voted_comments",
    "created_at"
  ]

  if (infoType && !infoTypes.includes(infoType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid infoType" });
  }

  let queryString = `SELECT ${infoType} FROM users ` +"WHERE username = $1"

  return db
    .query(queryString, [username])
    .then((result) => {
      return result.rows[0]
    })
}

/////////////////////////
const queryUserInfoCount = (username, infoCountType) => {
  const infoCountTypes = [
    "articles_count", "comments_count",
    "subscribed_topics_count",
    "followers_count", "following_count",
    "voted_articles_count", "voted_comments_count"
  ]

  if (infoCountType && !infoCountTypes.includes(infoCountType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid infoType" });
  }

  let infoType = ""
  switch (infoCountType) {
    case "articles_count":
      infoType = "articles"
      break;
    case "comments_count":
      infoType = "comments"
      break;
    case "subscribed_topics_count":
      infoType = "subscribed_topics"
      break;
    case "followers_count":
      infoType = "followers"
      break;
    case "following_count":
      infoType = "following"
      break;
    case "voted_articles_count":
      infoType = "voted_articles"
      break;
    case "voted_comments_count":
      infoType = "voted_comments"
      break;
  }

  let queryString = `SELECT cardinality(${infoType}) FROM users ` +"WHERE username = $1"

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
    username, 
    name, 
    email,
    description, 
    profile_colour, 
    avatar_img_url, 
    banner_img_url,
   } = user 

  return db
    .query(
      "INSERT INTO users (username, name, email, description, profile_colour, avatar_img_url, banner_img_url) "+ 
      "VALUES ($1, $2, $3) RETURNING *;",
      [username, name, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};


// PATCH USER
const updateUser = (username, user) => {
  // destructure user
  const {} = user

  return db
    .query(
      "UPDATE users () VALUES () WHERE username = $1", [username]
    )
    .then((result) => {
      return result.rows[0]
    })
};

const updateUserFollowing = (username, updatedFollowingArray) => {
  return db
    .query(
      "UPDATE USERS SET following=$2 WHERE username = $1", [username, updatedFollowingArray]
    )
}

const updateUserFollowers = (username, updatedFollowersArray) => {
  return db
    .query(
      "UPDATE USERS SET followers=$2 WHERE username = $1", [username, updatedFollowersArray]
    )
}

const updateUserArticles = (username, updatedArticlesArray) => {
  return db
  .query(
    "UPDATE USERS SET articles=$2 WHERE username = $1", [username, updatedArticlesArray]
  )
}

const updateUserComments = (username, updatedCommentsArray) => {
  return db
  .query(
    "UPDATE USERS SET comments=$2 WHERE username = $1", [username, updatedCommentsArray]
  )
}


// DELETE USER
const deleteFromUsers = (username) => {
  return db
  .query("DELETE FROM users WHERE username = $1 RETURNING *;", [username])
  .then((result) => {
    return result.rows[0]
  })
};


module.exports = {
  queryAllUsers, queryUserByUsername, queryUserInfo, queryUserInfoCount,
  insertIntoUsers,
  updateUser, updateUserFollowing, updateUserFollowers, updateUserArticles, updateUserComments,
  deleteFromUsers,
};
