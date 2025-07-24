const {
  queryAllArticles,
  queryArticleById,
  deleteFromArticles,
} = require("../models/articles.model");

const {
  queryCommentCount,
  queryCommentsByArticle,
} = require("../models/comments.model");

const getArticles = (req, res, next) => {
  const Queries = ["page", "topic", "sort_by", "order"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { page, topic, sort_by, order } = req.query;

  return queryAllArticles(sort_by, order, topic)
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      const promiseArray = [];
      for (let i = 0; i < articles.length; i++) {
        delete articles[i].body;
        promiseArray.push(queryCommentCount(articles[i].article_id));
      }
      Promise.all(promiseArray).then((values) => {
        for (let i = 0; i < values.length; i++) {
          articles[i].comment_count = values[i];
        }
        res.status(200).send({ articles: articles });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return queryArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      return queryCommentCount(article_id).then((commentCount) => {
        article.comment_count = commentCount;
        res.status(200).send({ article: article });
      });
    })
    .catch((err) => {
      next(err);
    });
};

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

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  return deleteFromArticles(article_id)
    .then(() => {
      return res.status(204).send({ msg: "204: No Content" });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticle,
  patchArticle,
  deleteArticle,
};
