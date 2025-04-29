const express = require("express");
const app = express();

const getApi = require("./controllers/api.controller.js");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentToArticle,
} = require("./controllers/nc_news.controller.js");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.get("/api/articles/:article_id", getArticleById);

app.post("api/articles/:article_id/comments", postCommentToArticle);

app.all("*splat", (req, res) => {
  res.status(404).send({ msg: "404: Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400: Bad Request" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
