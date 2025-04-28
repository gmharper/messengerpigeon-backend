const app = require("../api");
const models = require("../models/nc_news.model");

const queryTopics = require("../models/nc_news.model");

const getTopics = (req, res, next) => {
  return queryTopics(req.body).then((response) => {
    topics = response.rows;
    res.status(200).send({ topics: topics });
  });
};

module.exports = getTopics;
