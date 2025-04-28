const app = require("../api");
const models = require("../models/nc_news.model");

const { queryTopics, queryArticleById } = require("../models/nc_news.model");

const getTopics = (req, res, next) => {
  return queryTopics(req.body)
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

module.exports = { getTopics, getArticleById };
