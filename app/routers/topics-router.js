const { 
  getTopics, getTopicsData,
  getTopicBySlug, getTopicData,
  postTopic,
  patchTopic, patchTopicData,
  deleteTopic 
} = require("../controllers/topics.controller");

const topicsRouter = require("express").Router();

const patch_msg = "This endpoint does nothing! Use PATCH instead"

topicsRouter.route("/")
  .get(getTopics)
  .post(postTopic)
  .patch((req, res) => { res.status(200).send("This endpoint does nothing!") })
  .delete((req, res) => { res.status(200).send("This endpoint does nothing!") })

topicsRouter.route("/data/:dataType")
  .get(getTopicsData)

topicsRouter.route("/:slug")
  .get(getTopicBySlug)
  .post(() => { res.status(200).send("This endpoint does nothing! POST to the /topics endpoint or use PATCH instead") })
  .patch(patchTopic)
  .delete(deleteTopic)

topicsRouter.route("/:slug/:dataType")
  .get(getTopicData)
  .post((req, res) => { res.status(200).send({ msg: patch_msg }) })
  .patch(patchTopicData)
  .delete((req, res) => { res.status(200).send({ msg: patch_msg }) })

module.exports = topicsRouter;
