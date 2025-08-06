const { 
  queryAllUsers, queryUserByUsername, queryUserInfo, queryUserInfoCount,
  insertIntoUsers,
  updateUser, updateUserFollowers, updateUserFollowing, updateUserArticles, updateUserComments,
  deleteFromUsers
} = require("../models/users.model");


// GET
const getUsers = (req, res, next) => {
  return queryAllUsers()
    .then((users) => {
      return res.status(200).send({ users: users, msg: '' });
    })
    .catch((err) => {
      next(err)
    })
};

const getUser = (req, res, next) => {
  const { username } = req.params
  return queryUserByUsername(username)
    .then((user) => {
      return res.status(200).send( { user: user, msg: '' })
    })
    .catch((err) => {
      next(err)
    })
}

const getUserInfo = (req, res, next) => {
  const { username, infoType } = req.params;

  const infoTypeCounts = [
    "article_count", "comment_count",
    "subscribed_topics",
    "followers", "following",
    "voted_articles", "voted_comments"
  ]

  if (infoTypeCounts.includes(infoType)) {
    return queryUserInfoCount(username, infoType)
      .then((userInfoCount) => {
        if (!userInfoCount) {
          return res.status(404).send({ count: userInfoCount, msg: "404: Not Found" });
        }
        return res.status(200).send( { count: (userInfoCount.cardinality) })
      })
      .catch((err) => { next(err) })
  }

  return queryUserInfo(username, infoType)
    .then((userInfo) => {
      if (!userInfo) {
        return res.status(404).send({ info: userInfo, msg: "404: Not Found" });
      }
      return res.status(200).send( { info: userInfo[infoType] })
    })
    .catch((err) => { next(err) })
}


// POST
const postUser = (req, res, next) => {
  const { user } = req.body;

  // check if user object is of valid specifications
  return insertUser(user)
    .then((user) => {
      return res.status(200).send( { user: user, msg: '' })
    })
    .catch((err) => {
      next(err);
    });
};


// PATCH
const patchUser = (req, res, next) => {
  const { username } = req.params
  const { user } = req.body

  return updateUser(username, user)
    .then((user) => {
      return res.status(200).send( { user: user, msg: '' })
    })
    .catch((err) => {
      next(err)
    })
}

const patchUserInfo = (req, res, next) => {
  const { username, infoType } = req.params
  const { array } = req.body

  switch (infoType) {
    case 'followers':
      return updateUserFollowers(username, array)
      .then(() => { res.status(200).send( { msg: `Successfully patched user ${username}`})})
      .catch((err) => { next(err) })
    case 'following':
      return updateUserFollowing(username, array)
      .then(() => { res.status(200).send( { msg: `Successfully patched user ${username}`})})
      .catch((err) => { next(err) })
    case 'articles':
      return updateUserArticles(username, array)
      .then(() => { res.status(200).send( { msg: `Successfully patched user ${username}`})})
      .catch((err) => { next(err) })
    case 'comments':
      return updateUserComments(username, array)
      .then(() => { res.status(200).send( { msg: `Successfully patched user ${username}`})})
      .catch((err) => { next(err) })
    default:
      return res.status(401).send( { msg: 'no data' })
  }
}



// DELETE
const deleteUser = () => {
  return deleteFromUsers(username)
    .then((user) => {
      return res.status(200).send( { msg: `Successfully deleted user ${username}`})
    })
    .catch((err) => {
      next(err)
    })
}

module.exports = {
  getUsers, getUser, getUserInfo,
  postUser,
  patchUser, patchUserInfo,
  deleteUser
};
