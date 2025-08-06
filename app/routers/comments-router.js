const {
  getComments,
  getCommentById, getCommentsByUser, getCommentsByArticle,
  postComment,
  patchComment,
  deleteComment,
} = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

const patch_msg = "This endpoint does nothing! Use PATCH instead"

// /comments
commentsRouter.route("/")
  .get(getComments)
  .post(postComment)
  .patch(() => { res.status(200).send("This endpoint does nothing!") })
  .delete(() => { res.status(200).send("This endpoint does nothing!") })

commentsRouter.route("/:username")
  .get(getCommentsByUser)

commentsRouter.route("/:article_id")
  .get(getCommentsByArticle)

// /comments/:comment_id
commentsRouter.route("/:comment_id")
  .get(getCommentById)
  .post((req, res) => { res.status(200).send("This endpoint does nothing! POST to the /comments endpoint or use PATCH instead") })
  .patch(patchComment)                // patch by: votes,
  .delete(deleteComment);

commentsRouter.route("/:comment_id/:infoType")


module.exports = commentsRouter;
