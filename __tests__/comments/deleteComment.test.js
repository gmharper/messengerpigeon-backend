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
describe("DELETE /api/comments/:comment_id", () => {
    test("204: successfully deletes a comment", () => {
        return request(app)
            .delete("/api/comments/0")
            .expect(204)
    })
})

describe("errors", () => {
    test("deleting a comment that doesn't exist", () => {
        //
    })
})