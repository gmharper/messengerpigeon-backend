const express = require("express");
const app = express();

const getApi = require("./controllers/api.controller.js");

app.use(express.json());

app.get("/api", getApi);

module.exports = app;
