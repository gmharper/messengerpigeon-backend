const db = require("../../db/connection");
const format = require("pg-format");

// GET ALL TOPICS
const queryAllTopics = () => {
  return db
    .query("SELECT * FROM topics").then((result) => {
      return result.rows;
    });
};

// GET TOPIC BY SLUG
const queryTopicBySlug = (slug) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [slug])
    .then((result) => {
      return result.rows[0]
    })
}


/////////////////
const queryTopicInfo = (slug, infoType) => {
  const infoTypes = [
    "slug",
    "creator",
    "description",
    "subscribers",
    "img_url",
    "created_at"
  ]

  if (infoType && !infoTypes.includes(infoType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid infoType" });
  }

  let queryString = `SELECT ${infoType} FROM topics ` +"WHERE slug = $1"

  return db
    .query(queryString, [slug])
    .then((result) => {
      return result.rows[0]
    })
}


const queryTopicInfoCount = (slug, infoCountType) => {
  const infoCountTypes = [
    "subscriber_count",
  ]

  if (infoCountType && !infoCountTypes.includes(infoCountType)) {
    return Promise.reject({ status: 400, msg: "400: Invalid infoType" });
  }

  let infoType = ""
  switch (infoCountType) {
    case "subscriber_count":
      infoType = "subscribers"
      break;
  }

  let queryString = `SELECT cardinality(${infoType}) FROM topics ` +"WHERE slug = $1"

  return db
    .query(queryString, [slug])
    .then((result) => {
      return result.rows[0]
    })
}


// POST TOPIC
const insertIntoTopics = (topic) => {

const { slug, creator, description } = topic

  return db
    .query("INSERT INTO topics (slug, creator, description) "+
      "VALUES ($1 $2 $3) RETURNING *;",
      [slug, creator, description])
    .then((result) => {
      return result.rows[0];
    });
};


// PATCH TOPIC
const updateTopic = (slug, topic) => {
  // destructure topic
  const {} = topic

  return db
    .query(
      "UPDATE topics () VALUES () WHERE slug = $1 RETURNING *", [slug]
    ).then((result) => {
      return result.rows[0]
    })
}

const updateTopicArticles = (slug, articleArray) => {

}

const updateTopicSubscribers = (slug, subscribersArray) => {

}


// DELETE TOPIC
const deleteFromTopics = (slug) => {
  return db
    .query("DELETE FROM topics WHERE slug = $1;", [slug]);
};


module.exports = {
  queryAllTopics, queryTopicBySlug, queryTopicInfo, queryTopicInfoCount,
  insertIntoTopics,
  updateTopic, updateTopicArticles, updateTopicSubscribers,
  deleteFromTopics,
};
