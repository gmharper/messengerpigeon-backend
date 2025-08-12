const { 
  getUsers, getUsersData,
  getUserByUsername, getUserData,
  postUser,
  patchUser, patchUserData,
  deleteUser 
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

const patch_msg = "This endpoint does nothing! Use PATCH instead"

usersRouter.route("/")
  .get(getUsers)
  .post(postUser)
  .patch((req, res) => { res.status(200).send("This endpoint does nothing!") })
  .delete((req, res) => { res.status(200).send("This endpoint does nothing!") })

usersRouter.route("/data/:dataType")
  .get(getUsersData)

usersRouter.route("/:username")
  .get(getUserByUsername)
  .post((req, res) => { res.status(200).send("This endpoint does nothing! POST to the /users endpoint or use PATCH instead") })
  .patch(patchUser)
  .delete(deleteUser)

usersRouter.route("/:username/:dataType")
  .get(getUserData)
  .post((req, res) => { res.status(200).send(patch_msg) })                                         
  .patch(patchUserData)
  .delete((req, res) => { res.status(200).send(patch_msg) })

module.exports = usersRouter;
