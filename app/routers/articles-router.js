const {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  patchArticle,
  deleteArticle,
} = require("../controllers/articles.controller");

const {
  getComments,
  getCommentById,
  postComment,
  deleteComment,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

// /articles
articlesRouter
  .route("/")
  .get(getArticles)
  .post((req, res) => {
    res.status(200).send({ msg: "All OK from POST /api/articles" });
  })
  .patch((req, res) => {
    res.status(200).send({ msg: "All OK from PATCH /api/articles" });
  });

// /articles/:article_id
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .post((req, res) => {
    const { article_id } = req.params;
    res
      .status(201)
      .send({ msg: `All OK from POST /api/articles/${article_id}` });
  })
  .patch(patchArticle)
  .delete(deleteArticle);

// /articles/:article_id/comments
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment)
  .patch((req, res) => {
    const { article_id } = req.params;
    res
      .status(200)
      .send(`All OK from PATCH /api/articles/${article_id}/comments`);
  });

module.exports = articlesRouter;
