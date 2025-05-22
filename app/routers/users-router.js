const { getUsers, getUser } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter
  .route("/")
  .get(getUsers)
  .post((req, res) => {
    res.status(201).send("All OK from POST /api/users");
  })
  .patch((req, res) => {
    res.status(200).send("All OK from PATCH /api/users");
  });

usersRouter
  .route("/:username")
  .get(getUser)
  .patch((req, res) => {
    res.status(200).send("All OK from PATCH /api/users/:id");
  });

module.exports = usersRouter;
