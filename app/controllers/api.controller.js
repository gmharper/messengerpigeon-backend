const endpoints = require("../../endpoints.json");

const getApi = (request, response) => {
  response.status(200).send(endpoints);
};

module.exports = getApi;
