const db = require("../../db/connection");
const format = require("pg-format");

// GET ALL TOPICS
const queryAllTopics = (created_by="", sort='subscribers_count', order='DESC', page=0, limit=20, only) => {
  const Sorts = [
    "slug",
    "description",
    "created_by",
    "created_at",
    "subscribers_count"
  ];
  const Orders = ["ASC", "DESC"];

  if (sort && !Sorts.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (order && !Orders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order" });
  }
  if (typeof Number(page) != "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page" });
  }
  if (typeof Number(limit) != "number") {
    return Promise.reject({ status: 400, msg: "Invalid Page Limit" });
  }

  let queryString = "SELECT * FROM topics"
  let queryArray = []

  if (sort==="subscribers_count") queryString += ` ORDER BY cardinality(subscribers) ${order}`
  else queryString += ` ORDER BY ${sort} ${order}`

  queryString += ` OFFSET ${page*limit} LIMIT ${limit}`

  if (created_by) {
    queryString += " WHERE created_by=$1;"
    queryArray = [created_by]
  }

  return db
    .query(queryString, queryArray)
    .then((result) => {
      return result.rows;
    });
};

const queryTopicsData = (dataType) => {
  const dataTypes = [
    "slug","created_by","description","subscribers","img_url","created_at"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, msg: "400: Invalid dataType" })

  let queryString = `SELECT slug, ${dataType} FROM topics`

  return db
    .query(queryString)
    .then((result) => {
      return result.rows
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
const queryTopicData = (slug, dataType) => {
  const dataTypes = [
    "slug","created_by","description","subscribers","img_url","created_at"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, msg: "400: Invalid dataType" })

  let queryString = `SELECT ${dataType} FROM topics ` +"WHERE slug = $1"

  return db
    .query(queryString, [slug])
    .then((result) => {
      return result.rows[0]
    })
}


const queryTopicDataCount = (slug, countType) => {
  const countTypes = [
    "subscribers_count",
  ]

  if (!countTypes.includes(countType)) return Promise.reject({ status: 400, msg: "400: Invalid countType" })

  let dataType = ""
  switch (countType) {
    case "subscribers_count":
      dataType = "subscribers"
      break;
  }

  let queryString = `SELECT cardinality(${dataType}) FROM topics ` +"WHERE slug = $1"

  return db
    .query(queryString, [slug])
    .then((result) => {
      return result.rows[0]
    })
}


// POST TOPIC
const insertIntoTopics = (topic) => {

const { slug, created_by, description, img_url, created_at } = topic

  return db
    .query("INSERT INTO topics (slug, created_by, description, img_url, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [slug, created_by, description, img_url, created_at])
    .then((result) => {
      return result.rows[0];
    });
};


// PATCH TOPIC
const updateTopic = (slug2, topic) => {
  // destructure topic
  const { slug, description, img_url } = topic

  return db
    .query(
      "UPDATE topics SET slug=$2, description=$3, img_url=$4 WHERE slug = $1 RETURNING *;", 
      [slug2, slug, description, img_url]
    ).then((result) => {
      return result.rows[0]
    })
}

const updateTopicData = (slug, dataType, data) => {
  const dataTypes = [
    "slug", "description", "img_url", "created_by",
    "subscribers"
  ]

  if (!dataTypes.includes(dataType)) return Promise.reject({ status: 400, err_msg: "Invalid dataType" })

  let queryString = `UPDATE topics SET ${dataType}=$2` +" WHERE slug = $1 RETURNING *;"

  return db
    .query(queryString, [slug, data])
    .then((result) => {
      return result.rows[0]
    })
}


// DELETE TOPIC
const deleteFromTopics = (slug, dummy) => {
  if (dummy) {
    return db
      .query("SELECT * FROM topics WHERE slug = $1 RETURNING *;", [slug])
      .then((result) => {
        return result.rows[0]
      })
    }

  return db
    .query("DELETE FROM topics WHERE slug = $1 RETURNING *;", [slug])
    .then((result) => {
      return result.rows[0]
    })
};


module.exports = {
  queryAllTopics, queryTopicsData,
  queryTopicBySlug, queryTopicData, queryTopicDataCount,
  insertIntoTopics,
  updateTopic, updateTopicData,
  deleteFromTopics,
};
