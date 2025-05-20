const express = require("express");
const app = express();
const cors = require('cors');

const apiRouter = require("./routers/api-router");

app.use(cors());
app.use("/api", apiRouter);

app.use("/*splat", (req, res) => {
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
