const db = require("../db/connection.js");
const request = require("supertest");
const { app } = require("../app/api.js");
const endpointsJson = require("../endpoints.json");
require("jest-sorted");

const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});


//////////////////////////////////////
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
