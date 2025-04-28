const app = require("../api");

const {
  queryTopics,
  queryArticles,
  queryArticleById,
  queryCommentCount,
} = require("../models/nc_news.model");

const getTopics = (req, res, next) => {
  return queryTopics()
    .then((topics) => {
      if (!topics) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  return queryArticles()
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
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getArticles, getArticleById };
