const express = require("express");
const app = express();

const getApi = require("./controllers/api.controller.js");
const getTopics = require("./controllers/nc_news.controller.js");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", (req, res, next) => {
  getTopics(req, res, next);
});

// app.listen(9090, () => {
//   console.log("Server is listening on port 9090");
// });

module.exports = app;
