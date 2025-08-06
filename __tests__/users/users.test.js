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

//////////////////////////////////////////
describe("GET /api/users", () => {
  test("200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("404", () => {
    return request(app)
      .get("/api/notusers")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
  test("404", () => {
    return request(app)
      .get("/api/45564353")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
});
