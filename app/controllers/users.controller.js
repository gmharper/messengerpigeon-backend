const { 
  queryAllUsers, queryUsersData,
  queryUserByUsername, queryUserData, queryUserDataCount,
  insertIntoUsers,
  updateUser, updateUserData,
  deleteFromUsers
} = require("../models/users.model");


// GET
const getUsers = (req, res, next) => {
  const Queries = ["sort", "order", "p", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { sort, order, p, limit, only } = req.query;

  return queryAllUsers(sort, order, p, limit, only)
    .then((users) => {
      return res.status(200).send({ users: users, msg: "Successfully retrieved users" });
    })
    .catch((err) => { next(err) })
};

///////////////////
const getUserByUsername = (req, res, next) => {
  const { username } = req.params
  return queryUserByUsername(username)
    .then((user) => {
      return res.status(200).send({ user: user, msg: "Successfully retrieved user" })
    })
    .catch((err) => { next(err) })
}

////////////////////
const getUsersData = (req, res, next) => {
  const { dataType } = req.params

  return queryUsersData(dataType)
    .then((data) => {
      return res.status(200).send({ data: data, msg: `Successfully retrieved ${dataType} from users` })
    })
    .catch((err) => { next(err) })
}

////////////////////
const getUserData = (req, res, next) => {
  const { username, dataType } = req.params;

  const dataTypes = [
    "username", "name", "email", "description",
    "profile_colour", "avatar_img_url", "banner_img_url",
    "articles", "comments", "subscribed_topics",
    "followers", "following",
    "voted_articles", "voted_comments",
    "created_at",
    "articles_count", "comments_count", "subscribed_topics_count", 
    "followers_count", "following_count",
    "voted_articles_count", "voted_comments_count"
  ]

  const countTypes = [
    "articles_count", "comments_count",
    "subscribed_topics_count",
    "followers_count", "following_count",
    "voted_articles_count", "voted_comments_count"
  ]

  if (dataType==="endpoints") { return res.status(200).send({ endpoints: dataTypes }) }

  if (dataType && countTypes.includes(dataType)) {
    return queryUserDataCount(username, dataType)
      .then((userDataCount) => {
        if (!userDataCount) {
          return res.status(404).send({ count: userDataCount, msg: "404: Not Found" });
        }
        return res.status(200).send( { count: (userDataCount.cardinality), msg: "Successfully retrieved user data count" })
      })
      .catch((err) => { next(err) })
  }

  return queryUserData(username, dataType)
    .then((userData) => {
      if (!userData) {
        return res.status(404).send({ data: userData, msg: "404: Not Found" });
      }
      return res.status(200).send( { data: userData[dataType], msg: "Successfully retrieved user data" })
    })
    .catch((err) => { next(err) })
}


// POST
const postUser = (req, res, next) => {
  const { user } = {...req.body};

  if (typeof user !== "object") return res.status(400).send({ err_msg: "Input must be an object!"})
  if (Array.isArray(user)) return res.status(400).send({ err_msg: "Input must be an object!"})

  if (!user.hasOwnProperty("username") || !user.username) return res.status(400).send({ err_msg: "No username provided!" })  
  if (!user.hasOwnProperty("name") || !user.name) user.name = user.username
  if (!user.hasOwnProperty("email") || !user.email) return res.status(400).send({ err_msg: "No email provided!" })
  if (!user.hasOwnProperty("profile_colour") || !user.profile_colour) user.profile_colour = "white"
  if (!user.hasOwnProperty("avatar_img_url")) user.avatar_img_url = ""
  if (!user.hasOwnProperty("banner_img_url")) user.banner_img_url = ""
  if (!user.hasOwnProperty("banner_blend") || !user.banner_blend) user.banner_blend = "normal"
  if (!user.hasOwnProperty("banner_position") || !user.banner_position) user.banner_position = "center"
  if (!user.hasOwnProperty("articles" || !user.articles)) user.articles = []
  if (!user.hasOwnProperty("comments" || !user.comments)) user.comments = []
  if (!user.hasOwnProperty("subscribed_topics" || !user.subscribed_topics)) user.subscribed_topics = []
  if (!user.hasOwnProperty("followers" || !user.followers)) user.followers = []
  if (!user.hasOwnProperty("following" || !user.following)) user.following = []
  if (!user.hasOwnProperty("voted_articles" || !user.voted_articles)) user.voted_articles = []
  if (!user.hasOwnProperty("voted_comments" || !user.voted_comments)) user.voted_comments = []
  if (!topic.hasOwnProperty("created_at") || !topic.created_at) comment.created_at = new Date.now().toISOString()

  // check if user object is of valid specifications
  return insertIntoUsers(user)
    .then((user) => {
      return res.status(201).send( { user: user, msg: "Successfully posted new user" })
    })
    .catch((err) => { next(err) });
};


// PATCH
const patchUser = (req, res, next) => {
  const { username } = req.params
  const user = {...req.body}

  if (typeof user !== "object") return res.status(400).send({ err_msg: "Input must be an object!"})
  if (Array.isArray(user)) return res.status(400).send({ err_msg: "Input must be an object!"})

  if (!user.hasOwnProperty("name") || !user.name) user.name = user.username
  if (!user.hasOwnProperty("email") || !user.email) return res.status(400).send({ err_msg: "No email provided!" })
  if (!user.hasOwnProperty("profile_colour") || !user.profile_colour) user.profile_colour = "white"
  if (!user.hasOwnProperty("avatar_img_url")) user.avatar_img_url = ""
  if (!user.hasOwnProperty("banner_img_url")) user.banner_img_url = ""
  if (!user.hasOwnProperty("banner_blend") || !user.banner_blend) user.banner_blend = "normal"
  if (!user.hasOwnProperty("banner_position") || !user.banner_position) user.banner_position = "center"
  if (!user.hasOwnProperty("articles" || !user.articles)) user.articles = []
  if (!user.hasOwnProperty("comments" || !user.comments)) user.comments = []
  if (!user.hasOwnProperty("subscribed_topics" || !user.subscribed_topics)) user.subscribed_topics = []
  if (!user.hasOwnProperty("followers" || !user.followers)) user.followers = []
  if (!user.hasOwnProperty("following" || !user.following)) user.following = []
  if (!user.hasOwnProperty("voted_articles" || !user.voted_articles)) user.voted_articles = []
  if (!user.hasOwnProperty("voted_comments" || !user.voted_comments)) user.voted_comments = []
  if (!user.hasOwnProperty("created_at") || !user.created_at) user.created_at = new Date.now().toISOString()

  return updateUser(username, user)
    .then((user) => {
      return res.status(200).send({ user: user, msg: `Successfully patched user ${username}` })
    })
    .catch((err) => { next(err) })
}

//////////////////
const patchUserData = (req, res, next) => {
  const { username, dataType } = req.params
  const data = req.body.data

  const dataTypes = [
    "name", "email", "description",
    "profile_colour", "avatar_img_url", "banner_img_url", "banner_blend", "banner_position",
    "articles", "comments", "subscribed_topics",
    "followers", "following",
    "voted_articles", "voted_comments"
  ]

  if (dataType==="endpoints") { return res.status(200).send({ endpoints: dataTypes })}

  if (!dataTypes.includes(dataType)) return res.status(400).send({ err_msg: "Invalid dataType" })

  return updateUserData(username, dataType, data)
    .then((user) => {
      return res.status(200).send({ user: user, msg: `Successfully patched user ${username} ${dataType}`})
    })
    .catch((err) => { next(err) })
}


// DELETE
const deleteUser = (req, res, next) => {
  const { username } = req.params

  const Queries = ["dummy"]

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, err_msg: "Invalid Query" });
    }
  }
  const { dummy } = req.query

  return deleteFromUsers(username, dummy)
    .then((deletedUser) => {
      return res.status(200).send( { user: deletedUser, msg: `Successfully deleted user ${username}`})
    })
    .catch((err) => { next(err) })
}


module.exports = {
  getUsers, getUsersData,
  getUserByUsername, getUserData,
  postUser,
  patchUser, patchUserData,
  deleteUser
};
