const {
  getArticles, getArticleById, getArticleInfo, getArticlesByTopic, getArticlesByUser,
  postArticle,
  patchArticle, patchArticleInfo,
  deleteArticle,
} = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

const patch_msg = "This endpoint does nothing! Use PATCH instead"

// /articles
articlesRouter.route("/")
  .get(getArticles)
  .post(postArticle)
  .patch((req, res) => { res.status(200).send("This endpoint does nothing!") })
  .delete((req, res) => { res.status(200).send("This endpoint does nothing!") })

// /articles/:article_id
articlesRouter.route("/:article_id")
  .get(getArticleById)
  .post(() => { res.status(200).send("This endpoint does nothing! POST to the /articles endpoint or use PATCH instead") })
  .patch(patchArticle)
  .delete(deleteArticle);

articlesRouter.route("/:article_id/:infoType")
  .get(getArticleInfo)
  .post((req, res) => { res.status(200).send( { msg, patch_msg }) })
  .patch(patchArticleInfo)
  .delete((req, res) => { res.status(200).send( { msg, patch_msg }) })

module.exports = articlesRouter;
