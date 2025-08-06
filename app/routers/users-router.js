const { 
  getUsers, getUser, getUserInfo,
  postUser,
  patchUser, patchUserInfo,
  deleteUser 
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

const patch_msg = "This endpoint does nothing! Use PATCH instead"

usersRouter.route("/")
  .get(getUsers)
  .post(postUser)
  .patch((req, res) => { res.status(200).send("This endpoint does nothing!") })
  .delete((req, res) => { res.status(200).send("This endpoint does nothing!") })

usersRouter.route("/:username")
  .get(getUser)
  .post((req, res) => { res.status(200).send("This endpoint does nothing! POST to the /users endpoint or use PATCH instead") })
  .patch(patchUser)
  .delete(deleteUser)

usersRouter.route("/:username/:infoType")
  .get(getUserInfo)
  .post((req, res) => { res.status(200).send(patch_msg) })                                         
  .patch(patchUserInfo)
  .delete((req, res) => { res.status(200).send(patch_msg) })

module.exports = usersRouter;
