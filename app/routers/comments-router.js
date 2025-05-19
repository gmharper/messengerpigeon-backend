const {
  getComments,
  getCommentById,
  postComment,
  deleteComment,
} = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

// /comments
commentsRouter.route("/").get(getComments).post(postComment);

// /comments/:comment_id
commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .patch((req, res) => {
    const { comment_id } = req.params;
    res
      .status(200)
      .send({ msg: `All OK from PATCH /api/comments/${comment_id}` });
  })
  .delete(deleteComment);

module.exports = commentsRouter;
