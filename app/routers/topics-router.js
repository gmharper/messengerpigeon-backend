const { getTopics, postTopic } = require("../controllers/topics.controller");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics).post(postTopic);

topicsRouter
  .route("/:id")
  .get((req, res) => {
    res.status(201).send("All OK from GET /api/topics/:id");
  })
  .patch((req, res) => {
    res.status(200).send("All OK from PATCH /api/topics/:id");
  });
//.delete(deleteTopic)

module.exports = topicsRouter;
