const {
  queryAllComments, queryCommentsData,
  queryCommentById, queryCommentData, queryCommentDataCount,
  insertIntoComments,
  updateComment, updateCommentData,
  deleteFromComments,
} = require("../models/comments.model");

// GET
const getComments = (req, res, next) => {
  const Queries = ["username", "article_id", "sort", "order", "p", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { username, article_id, sort, order, p, limit, only } = req.query;

  return queryAllComments(username, article_id, sort, order, p, limit, only)
    .then((comments) => {
      return res.status(200).send({ comments: comments, msg: "Successfully retrieved comments" });
    })
    .catch((err) => { next(err) })
};

//////////////////
const getCommentsData = (req, res, next) => {
  const { dataType } = req.params

  return queryCommentsData(dataType)
    .then((data) => {
      return res.status(200).send({ data: data, msg: `Successfully retrieved ${dataType} from comments` })
    })
    .catch((err) => { next(err) })
}

///////////////////
const getCommentById = (req, res, next) => {
  const { comment_id } = req.params
  
  return queryCommentById(comment_id)
    .then((comment) => {
      return res.status(200).send({ comment: comment })
    })
    .catch((err) => { next(err) })
};

///////////////////
const getCommentData = (req, res, next) => {
  const { comment_id, dataType } = req.params

  const dataTypes = [
    "comment_id", "article_id", "article_title", "author", "body", "voted_by", "created_at",
    "votes_count"
  ]

  const countTypes = [
    "votes_count"
  ]

  if (!dataTypes.includes(dataType)) return res.status(400).send({ err_msg: "Invalid dataType" })

  if (dataType==="endpoints") return res.status(200).send({ endpoints: dataTypes })

  if (dataType && countTypes.includes(dataType)) {
    return queryCommentDataCount(comment_id, dataType)
      .then((commentDataCount) => {
        if (!commentDataCount) {
          return res.status(404).send({ count: commentDataCount, msg: "404: Not Found" })
        }
        return res.status(200).send({ count: commentDataCount.cardinality, msg: "" })
      })
      .catch((err) => { next(err) })
  }

  return queryCommentData(comment_id, dataType)
    .then((commentData) => {
      if (!commentData) {
        return res.status(404).send({ data: commentData, msg: "404: Not Found" });
      }
      return res.status(200).send({ data: commentData[dataType], msg: "" })
    })
    .catch((err) => { next(err) })
}



// POST
const postComment = (req, res, next) => {
  const comment = {...req.body};

  if (typeof comment !== "object") return res.status(400).send({ err_msg: "Input must be an object!"})
  if (Array.isArray(comment)) return res.status(400).send({ err_msg: "Input must be an object!"})

  if (!comment.hasOwnProperty("article_id")) return res.status(400).send({ err_msg: "No article id provided!" })  
  if (!comment.hasOwnProperty("article_title") || !comment.article_title) return res.status(400).send({ err_msg: "No article title provided!" })
  if (!comment.hasOwnProperty("author") || !comment.author) return res.status(400).send({ err_msg: "No author provided!" })
  if (!comment.hasOwnProperty("body") || !comment.body) return res.status(400).send({ err_msg: "No body provided!" })
  if (!comment.hasOwnProperty("voted_by" || !comment.voted_by)) comment.voted_by = []
  if (!comment.hasOwnProperty("created_at") || !comment.created_at) comment.created_at = new Date.now().toISOString()

  return insertIntoComments(comment)
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      return res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      console.error("postComment error");
      next(err);
    });
};



// PATCH
const patchComment = (req, res, next) => {
  const { comment_id } = req.params
  const comment = {...req.body}

  if (!comment.hasOwnProperty("author") || !comment.author) return res.status(400).send({ err_msg: "No author provided!" })
  if (!comment.hasOwnProperty("body") || !comment.body) return res.status(400).send({ err_msg: "No body provided!" })

  return updateComment(comment_id, comment)
    .then((comment) => {
      return res.status(200).send({ comment: comment, msg: `Successfully patched comment ${comment_id}` })
    })
    .catch((err) => { next(err) })
}

///////////////////////
const patchCommentData = (req, res, next) => {
  const { comment_id, dataType } = req.params
  const data = req.body.data

  const dataTypes = [
    "author", "body", "voted_by", "created_at",
  ]

  if (!dataTypes.includes(dataType)) return res.status(400).send({ err_msg: "Invalid dataType" })

  if (dataType==="endpoints") return res.status(200).send({ endpoints: dataTypes })

  if (dataType==="voted_by" && !Array.isArray(data)) return res.status(400).send({ err_msg: "sent data for voted_by must be of type array"})

  return updateCommentData(comment_id, dataType, data)
    .then((comment) => {
      return res.status(200).send({ comment: comment, msg: `Successfully patched comment ${comment_id} ${dataType}`})
    })
    .catch((err) => { next(err) })
}

///////////////////////
const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  const Queries = ["dummy"]

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, err_msg: "Invalid Query" });
    }
  }
  const { dummy } = req.query

  return deleteFromComments(comment_id, dummy)
    .then((deletedComment) => {
      return res.status(204).send({ comment: deletedComment, msg: `successfully deleted comment ${comment_id}` });
    })
    .catch((err) => { next(err) });
};

module.exports = {
  getComments, getCommentsData,
  getCommentById, getCommentData,
  postComment,
  patchComment, patchCommentData,
  deleteComment,
};
