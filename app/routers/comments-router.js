const {
  getComments, getCommentsData,
  getCommentById, getCommentData, getCommentsByUser, getCommentsByArticle,
  postComment,
  patchComment, patchCommentData,
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

commentsRouter.route("/data/:dataType")
  .get(getCommentsData)

// /comments/:comment_id
commentsRouter.route("/:comment_id")
  .get(getCommentById)
  .post((req, res) => { res.status(200).send("This endpoint does nothing! POST to the /comments endpoint or use PATCH instead") })
  .patch(patchComment)                // patch by: votes,
  .delete(deleteComment);

commentsRouter.route("/:comment_id/:dataType")
  .get(getCommentData)
  .post((req, res) => { res.status(200).send(patch_msg) })
  .patch(patchCommentData)
  .delete((req, res) => { res.status(200).send(patch_msg) })


module.exports = commentsRouter;
