const db = require("../../db/connection.js");
const request = require("supertest");
const app = require("../../app/api.js");
require("jest-sorted");

const data = require("../../db/data/test-data/index.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

////////////////////////////////////////////
describe("DELETE /api/articles/:article_id", () => {
  test("204: successfully deletes the article", () => {
    return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then((response) => {
          response
          .get("/api/articles/")
          .expect(200)
          .then((response) => {
            console.log(response.body)
        })
        })
        
  })
});