const { queryAllTopics, insertTopic } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  return queryAllTopics()
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

const postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  return insertTopic(slug, description)
    .then((topic) => {
      if (!topic) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(201).send({ topic, topic });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  postTopic,
};
