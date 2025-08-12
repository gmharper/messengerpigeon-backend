const {
  getArticles, getArticlesData,
  getArticleById, getArticleData, getArticlesByTopic, getArticlesByUser,
  postArticle,
  patchArticle, patchArticleData,
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

articlesRouter.route("/data/:dataType")
  .get(getArticlesData)

// /articles/:article_id
articlesRouter.route("/:article_id")
  .get(getArticleById)
  .post(() => { res.status(200).send("This endpoint does nothing! POST to the /articles endpoint or use PATCH instead") })
  .patch(patchArticle)
  .delete(deleteArticle);

articlesRouter.route("/:article_id/:dataType")
  .get(getArticleData)
  .post((req, res) => { res.status(200).send( { msg, patch_msg }) })
  .patch(patchArticleData)
  .delete((req, res) => { res.status(200).send( { msg, patch_msg }) })

module.exports = articlesRouter;
