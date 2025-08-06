const { 
  getTopics, getTopicBySlug, getTopicInfo,
  postTopic,
  patchTopic, patchTopicInfo,
  deleteTopic 
} = require("../controllers/topics.controller");

const topicsRouter = require("express").Router();

const patch_msg = "This endpoint does nothing! Use PATCH instead"

topicsRouter.route("/")
  .get(getTopics)
  .post(postTopic)
  .patch((req, res) => { res.status(200).send("This endpoint does nothing!") })
  .delete((req, res) => { res.status(200).send("This endpoint does nothing!") })

topicsRouter.route("/:slug")
  .get(getTopicBySlug)
  .post(() => { res.status(200).send("This endpoint does nothing! POST to the /topics endpoint or use PATCH instead") })
  .patch(patchTopic)
  .delete(deleteTopic)

topicsRouter.route("/:slug/:infoType")
  .get(getTopicInfo)
  .post((req, res) => { res.status(200).send(patch_msg) })
  .patch(patchTopicInfo)
  .delete((req, res) => { res.status(200).send(patch_msg) })

module.exports = topicsRouter;
