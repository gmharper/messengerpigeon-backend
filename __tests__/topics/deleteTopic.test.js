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

//////////////////////////////
describe("DELETE /api/topics/:slug", () => {
    test("204: successfully deletes a topic", () => {
        return request(app)
            .delete("/api/topics/coding")
            .expect(204)
    })
})

describe("errors", () => {
    test("deleting a topic that doesn't exist", () => {
        //
    })
})