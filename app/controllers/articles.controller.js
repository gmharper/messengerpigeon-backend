
const {
  queryAllArticles, queryArticlesData,
  queryArticleById, queryArticleData, queryArticleDataCount,
  insertIntoArticles,
  updateArticle, updateArticleData,
  deleteFromArticles,
} = require("../models/articles.model");


// GET
const getArticles = (req, res, next) => {
  const Queries = ["topic", "author", "sort", "order", "p", "limit", "only"]; // valid queries

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, err_msg: "Invalid Query" });
    }
  }
  const { topic, author, sort, order, p, limit, only } = req.query;

  return queryAllArticles(topic, author, sort, order, p, limit, only)
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ err_msg: "404: Not Found" });
      } else {
        res.status(200).send({ articles: articles });
      }
    })
    .catch((err) => { next(err) });
};

///////////////
const getArticlesData = (req, res, next) => {
  const { dataType } = req.params

  return queryArticlesData(dataType)
    .then((data) => {
      return res.status(200).send({ data: data, msg: `Successfully retrieved ${dataType} from articles` })
    })
    .catch((err) => { next(err) })
}


////////////////
const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return queryArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ err_msg: "404: Not Found" });
      }
        return res.status(200).send({ article: article });
      })
    .catch((err) => { next(err); });
};


//////////////////
const getArticleData = (req, res, next) => {
  const { article_id, dataType } = req.params;

  const dataTypes = [
    "article_id", "title", "body", "author", "voted_by", "comments", "img_url", "created_at",
    "comments_count", "votes_count"
  ]

  const countTypes = [
    "comments_count", "votes_count"
  ]

  if (dataType==="endpoints") return res.status(200).send({ endpoints: dataTypes })

  if (!dataTypes.includes(dataType)) return res.status(400).send({ err_msg: "400: Invalid dataType" })

  if (countTypes.includes(dataType)) {
    return queryArticleDataCount(article_id, dataType)
      .then((articleDataCount) => {
        if (!articleDataCount) {
          return res.status(404).send({ count: articleDataCount, err_msg: "404: Not Found" });
        }
        return res.status(200).send( { count: (articleDataCount.cardinality) })
      })
      .catch((err) => { next(err) })
  }

  return queryArticleData(article_id, dataType)
    .then((articleData) => {
      if (!articleData) {
        return res.status(404).send({ data: articleData, err_msg: "404: Not Found" });
      }
      return res.status(200).send( { data: articleData[dataType] })
    })
    .catch((err) => { next(err) })
}


// POST
const postArticle = (req, res, next) => {
  const article = {...req.body}

  if (typeof article !== "object") return res.status(400).send({ err_msg: "Input must be an object!"})
  if (Array.isArray(article)) return res.status(400).send({ err_msg: "Input must be an object!"})

  if (!article.hasOwnProperty("title") || !article.title) return res.status(400).send({ err_msg: "No title provided!" })
  if (!article.hasOwnProperty("author") || !article.author) return res.status(400).send({ err_msg: "No author provided!" })
  if (!article.hasOwnProperty("body") || !article.body) return res.status(400).send({ err_msg: "No body provided!" })
  if (!article.hasOwnProperty("comments" || !article.comments)) article.comments = []
  if (!article.hasOwnProperty("voted_by" || !article.voted_by)) article.voted_by = []
  if (!article.hasOwnProperty("img_url")) article.img_url = ""
  if (!article.hasOwnProperty("created_at") || !article.created_at) article.created_at = new Date.now().toISOString()

  return insertIntoArticles(article)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ err_msg: "404: Not Found" });
      }
      return res.status(201).send({ article: article })
    })
    .catch((err) => { next(err) })
}


// PATCH
const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const article = {...req.body}

  if (!article.hasOwnProperty("title") || !article.title) return res.status(400).send({ err_msg: "No title provided!" })
  if (!article.hasOwnProperty("author") || !article.author) return res.status(400).send({ err_msg: "No author provided!" })
  if (!article.hasOwnProperty("body") || !article.body) return res.status(400).send({ err_msg: "No body provided!" })

  return updateArticle(article_id, article)
    .then((article) => {
      return res.status(200).send({ article: article, msg: `Successfully patched article ${article_id}: ${article.title}`})
    })
    .catch((err) => { next(err) })
};


const patchArticleData = (req, res, next) => {
  const { article_id, dataType } = req.params;
  const data = req.body.data

  const dataTypes = [
    "title", "body", "author", "voted_by", "img_url", "created_at",
  ] 

  if (!dataTypes.includes(dataType)) return res.status(400).send({ err_msg: "Invalid dataType" })

  if (dataType==="voted_by" && !Array.isArray(data)) return res.status(400).send({ err_msg: "sent data for voted_by must be of type array" })
  if (dataType==="comments" && !Array.isArray(data)) return res.status(400).send({ err_msg: "sent data for comments must be of type array" })

  return updateArticleData(article_id, dataType, data)
    .then((article) => {
      return res.status(200).send({ article: article, msg: `Successfully patched article ${article_id} ${dataType}`})
    })
    .catch((err) => { next(err) })
}


// DELETE
const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  const Queries = ["dummy"]

  for (const key in req.query) {
    if (!Queries.includes(key)) {
      // if not a valid query paramater
      return Promise.reject({ status: 400, err_msg: "Invalid Query" });
    }
  }
  const { dummy } = req.query
  
  return deleteFromArticles(article_id, dummy)
    .then((deletedArticle) => {
      return res.status(204).send({ article: deletedArticle, msg: `Successfully deleted article ${deletedArticle.title}` });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles, getArticlesData,
  getArticleById, getArticleData,
  postArticle,
  patchArticle, patchArticleData,
  deleteArticle,
};
