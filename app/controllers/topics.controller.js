const { 
  queryAllTopics, queryTopicsData, 
  queryTopicBySlug, queryTopicData, queryTopicDataCount,
  insertIntoTopics,
  updateTopic, updateTopicData,
  deleteFromTopics } = require("../models/topics.model");


// GET
const getTopics = (req, res, next) => {
  const Queries = ["created_by", "sort", "order", "p", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, msg: "Invalid Query" });
    }
  }
  const { created_by, sort, order, p, limit, only } = req.query;

  return queryAllTopics(created_by, sort, order, p, limit, only)
    .then((topics) => {
      if (!topics) {
        return res.status(404).send({ topics: topics, msg: "404: Not Found" });
      }
      res.status(200).send({ topics: topics, msg: "Successfully retrieved topics" });
    })
    .catch((err) => { next(err) });
};

//////////////////
const getTopicsData = (req, res, next) => {
  const { dataType } = req.params

  return queryTopicsData(dataType)
    .then((data) => {
      return res.status(200).send({ data: data, msg: `Successfully retrieved ${dataType} from topics` })
    })
    .catch((err) => { next(err) })
}

//////////////////
const getTopicBySlug = (req, res, next) => {
  const { slug } = req.params

  return queryTopicBySlug(slug)
    .then((topic) => {
      if (!topic) {
        return res.status(404).send({ topic: topic, msg: "404: Not Found" });
      }
      res.status(200).send({ topic: topic, msg: `Successfully retrieved ${slug} topics` })
    })
    .catch((err) => { next(err) })
}

/////////////////
const getTopicData = (req, res, next) => {
  const { slug, dataType } = req.params

  const endpoints = [
    "slug", "description", "created_by", "subscribers", "img_url", "created_at",
    "subscribers_count"
  ]

  const countTypes = [
    "subscribers_count"
  ]

  if (dataType==="endpoints") {
    return res.status(200).send({ endpoints: endpoints })
  }

  if (dataType && countTypes.includes(dataType)) {
    return queryTopicDataCount(slug, dataType)
      .then((topicDataCount) => {
        if (!topicDataCount) {
          return res.status(404).send({ count: topicDataCount, msg: "404: Not Found" })
        }
        return res.status(200).send({ count: topicDataCount.cardinality, msg: "" })
      })
      .catch((err) => { next(err) })
  }

  return queryTopicData(slug, dataType)
    .then((topicData) => {
      if (!topicData) {
        return res.status(404).send({ data: topicData, msg: "404: Not Found" });
      }
      return res.status(200).send({ data: topicData[dataType], msg: "" })
    })
    .catch((err) => { next(err) })
}



// POST
const postTopic = (req, res, next) => {
  const topic = {...req.body};

  if (typeof topic !== "object") return res.status(400).send({ err_msg: "Input must be an object!"})
  if (Array.isArray(topic)) return res.status(400).send({ err_msg: "Input must be an object!"})

  if (!topic.hasOwnProperty("slug") || !topic.slug) return res.status(400).send({ err_msg: "No slug provided!" })  
  if (!topic.hasOwnProperty("created_by") || !topic.created_by) return res.status(400).send({ err_msg: "No creator provided!" })
  if (!topic.hasOwnProperty("description") || !topic.description) return res.status(400).send({ err_msg: "No description provided!" })
  if (!topic.hasOwnProperty("subscribers" || !topic.subscribers)) comment.subscribers = []
  if (!topic.hasOwnProperty("created_at") || !topic.created_at) comment.created_at = new Date.now().toISOString()

  return insertIntoTopics(topic)
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
  const topic = {...req.body}

  if (!topic.hasOwnProperty("slug") || !topic.slug) return res.status(400).send({ err_msg: "No slug provided!" })
  if (!topic.hasOwnProperty("description") || !topic.description) return res.status(400).send({ err_msg: "No description provided!" })

  return updateTopic(slug, topic)
    .then((topic) => {
      return res.status(200).send({ topic: topic, msg: `Successfully patched topic ${slug}` })
    })
    .catch((err) => { next(err) })
}


const patchTopicData = (req, res, next) => {
  const { slug, dataType } = req.params
  const data = req.body.data

  const dataTypes = [
    "slug", "description", "created_by", "subscribers", "img_url", "created_at",
  ]

  if (!dataTypes.includes(dataType)) return res.status(400).send({ err_msg: "Invalid dataType" })

  return updateTopicData(slug, dataType, data)
    .then((topic) => {
      return res.status(200).send({ topic: topic, msg: `Successfully patched topic ${slug} ${dataType}`})
    })
    .catch((err) => { next(err) })
}


// DELETE
const deleteTopic = (req, res, next) => {
  const { slug } = req.params

  const Queries = ["dummy"]

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, err_msg: "Invalid Query" });
    }
  }
  const { dummy } = req.query

  return deleteFromTopics(slug, dummy)
    .then((deletedTopic) => {
      return res.status(200).send( { topic: deletedTopic, msg: `Successfully deleted topic ${slug}`})
    })
    .catch((err) => { next(err) })
}


module.exports = {
  getTopics, getTopicsData,
  getTopicBySlug, getTopicData,
  postTopic,
  patchTopic, patchTopicData,
  deleteTopic
};
