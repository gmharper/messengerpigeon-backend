const { 
  queryAllTopics, queryTopicBySlug, queryTopicInfo, queryTopicInfoCount,
  insertIntoTopics,
  updateTopic, updateTopicArticles, updateTopicSubscribers,
  deleteFromTopics } = require("../models/topics.model");


// GET
const getTopics = (req, res, next) => {
  const { slug } = req.params
  
  return queryAllTopics()
    .then((topics) => {
      if (!topics) {
        return res.status(404).send({ topics: topics, msg: "404: Not Found" });
      }
      res.status(200).send({ topics: topics, msg: "" });
    })
    .catch((err) => { next(err) });
};

//////////////////
const getTopicBySlug = (req, res, next) => {
  const { slug } = req.params

  return queryTopicBySlug(slug)
    .then((topic) => {
      if (!topic) {
        return res.status(404).send({ topic: topic, msg: "404: Not Found" });
      }
      res.status(200).send({ topic: topic, msg: "" })
    })
}

/////////////////
const getTopicInfo = (req, res, next) => {
  const { slug, infoType } = req.params

  if (infoType==="subscriber_count") {
    return queryTopicInfoCount(slug, infoType)
      .then((topicInfoCount) => {
        if (!topicInfoCount) {
          return res.status(404).send({ count: topicInfoCount, msg: "404: Not Found" })
        }
        return res.status(200).send({ count: topicInfoCount.cardinality, msg: "" })
      })
      .catch((err) => { next(err) })
  }

  return queryTopicInfo(slug, infoType)
    .then((topicInfo) => {
      if (!topicInfo) {
        return res.status(404).send({ info: topicInfo, msg: "404: Not Found" });
      }
      return res.status(200).send({ info: topicInfo[infoType], msg: "" })
    })
    .catch((err) => { next(err) })
}



// POST
const postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  return insertTopic(slug, description)
    .then((topic) => {
      if (!topic) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(201).send({ topic, topic, msg: '' });
    })
    .catch((err) => { next(err) });
};


// PATCH
const patchTopic = (req, res, next) => {
  const { slug } = req.params
  const { topic } = req.body

  return updateTopic(slug, topic)
    .then((topic) => {
      return res.status(200).send({ topic: topic, msg: '' })
    })
    .catch((err) => { next(err) })
}

const patchTopicInfo = (req, res, next) => {
  const { slug, infoType } = req.params
  const { array } = req.body

  switch (infoType) {
    case 'articles':
      return updateTopicArticles(slug, array)
      .then(() => { return })
      .catch((err) => { next(err) })
    case 'subscribers':
      return updateTopicSubscribers(slug, array)
      .then(() => { return })
      .catch((err) => { next(err) })
    default:
      return res.status(401).send("no data")
  }
}


// DELETE
const deleteTopic = (req, res, next) => {
  const { slug } = req.params
  return deleteFromTopics(slug)
    .then(() => {
      res.status(200).send( { msg: `Successfully deleted topic ${slug}`})
    })
    .catch((err) => { next(err) })
}


module.exports = {
  getTopics, getTopicBySlug, getTopicInfo,
  postTopic,
  patchTopic, patchTopicInfo,
  deleteTopic
};
