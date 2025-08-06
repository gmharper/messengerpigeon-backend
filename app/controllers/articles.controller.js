
const {
  queryAllArticles, queryArticleById, queryArticleInfo, queryArticleInfoCount,
  insertIntoArticles,
  updateArticle, updateArticleVotes, updateArticleComments, 
  deleteFromArticles,
  queryArticlesByUser,
} = require("../models/articles.model");

const {
  queryCommentCount,
  queryCommentsByArticle,
} = require("../models/comments.model");


// GET
const getArticles = (req, res, next) => {
  const Queries = ["topic", "username", "sort", "order", "page", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { topic, username, sort, order, page, limit, only } = req.query;

  return queryAllArticles(topic, username, sort, order, page, limit, only)
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ msg: "404: Not Found" });
      } else {
        res.status(200).send({ articles: articles });
      }
    })
    .catch((err) => {
      next(err);
    });
};


////////////////
const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return queryArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
        return res.status(200).send({ article: article });
      })
    .catch((err) => { next(err); });
};


//////////////////
const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params
  const Queries = ["sort", "order", "page", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { sort, order, page, limit, only } = req.query;

  return queryArticlesByTopic(topic, sort, order, page, limit, only)
    .then((articles) => {
      return res.status(200).send({ articles: articles })
    })
    .catch((err) => { next(err) })
}


//////////////////
const getArticlesByUser = (req, res, next) => {
  const { username } = req.params
  const Queries = ["sort", "order", "page", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { sort, order, page, limit, only } = req.query;

  return queryArticlesByUser(username, sort, order, page, limit, only)
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ articles: articles, msg: "404: Not Found" });
      }
      return res.status(200).send({ articles: articles })
    })
    .catch((err) => { next(err) })
}


//////////////////
const getArticleInfo = (req, res, next) => {
  const { article_id, infoType } = req.params;

  if (infoType==="comment_count" || infoType==="vote_count") {
    return queryArticleInfoCount(article_id, infoType)
      .then((articleInfoCount) => {
        if (!articleInfoCount) {
          return res.status(404).send({ count: articleInfoCount, msg: "404: Not Found" });
        }
        return res.status(200).send( { count: (articleInfoCount.cardinality) })
      })
      .catch((err) => { next(err) })
  }

  return queryArticleInfo(article_id, infoType)
    .then((articleInfo) => {
      if (!articleInfo) {
        return res.status(404).send({ info: articleInfo, msg: "404: Not Found" });
      }
      return res.status(200).send( { info: articleInfo[infoType] })
    })
    .catch((err) => { next(err) })
}


//////////////////
const getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;

  return queryCommentsByArticle(article_id)
    .then((comments) => {
      if (!comments || comments.length === 0) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};


// POST
const postArticle = (req, res, next) => {
  const { article } = req.body

  return insertIntoArticles(article)
    .then((article) => {
      res.status(200).send({ article: article })
    })
    .catch((err) => { next(err) })
}


// PATCH
const patchArticle = (req, res, next) => {
  const { article_id } = req.params;

  if (!req.body.hasOwnProperty("inc_votes")) {
    return res.status(400).send({ msg: "400: Bad Request" });
  }
  if (!typeof req.body.inc_votes === "number") {
    return res.status(400).send({ msg: "400: Bad Request" });
  }

  const { inc_votes } = req.body;
  return updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      if (!article) {
        res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};


const patchArticleInfo = (req, res, next) => {
  const { article_id, infoType } = req.params;
  const { votes, comments} = req.body

  switch (infoType) {
    case "votes":
      if (votes) {
        return updateArticleVotes(article_id, votes)
          .then(() => {
            res.status(200).send({ msg: "Successfully updated article"})
          })
          .catch((err) => { next(err) })
      } break;
    case "comments":
      if (comments) {
        return updateArticleComments(article_id, comments)
          .then(() => {
            res.status(200).send({ msg: "Successfully updated article"})
          })
          .catch((err) => { next(err) })
      } break;
    default:
      return res.status(400).send({ msg: "Bad Request"})
  }
}


// DELETE
const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  
  return deleteFromArticles(article_id)
    .then((articles) => {
      return res.status(204).send({ articles: articles, msg: "204: No Content" });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles, getArticleById, getCommentsByArticle, getArticleInfo, getArticlesByTopic, getArticlesByUser,
  postArticle,
  patchArticle, patchArticleInfo,
  deleteArticle,
};
