const {
  queryAllComments,
  queryCommentById,
  insertComment,
  deleteFromComments,
} = require("../models/comments.model");

const getComments = (req, res, next) => {
  return queryAllComments().then((comments) => {
    res.status(200).send({ comments: comments });
  });
};

const getCommentById = (req, res, next) => {
  return queryCommentById(comment_id).then((comment) => {
    res.status(200).send({ comment: comment });
  });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertComment(article_id, username, body)
    .then((comment) => {
      // if (!comment) {
      //   return res.status(404).send({ msg: "404: Not Found" });
      // }
      return res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      console.error("postComment error");
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteFromComments(comment_id)
    .then(() => {
      return res.status(204).send({ msg: "No Content" });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getComments,
  getCommentById,
  postComment,
  deleteComment,
};
