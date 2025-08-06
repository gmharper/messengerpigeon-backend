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

/////////////////////////////////////////
describe("GET /api/topics", () => {
  test("200: returns the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;

        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              type: expect.any(String),
              creator: expect.any(String),
              description: expect.any(String),
              subscribers: expect.any(Array),
              img_url: expect.any(String),
              created_at: expect.any(String)
            })
          );
        });
      });
  });
});

///////////////////////////////////////
describe("GET /api/topics/:slug", () => {
  test("200: returns the topic object", () => {
    return request(app)
      .get("/api/topics/coding")
      .expect(200)
      .then((response) => {
        console.log(response.body.topic)
      });
  })
})

///////////////////////////////////////
describe("GET /api/topics/slug/:infoType", () => {
  test("200: returns an array with the comments objects", () => {
    return request(app)
      .get("/api/topics/coding/slug")
      .expect(200)
      .then((response) => {
        expect(response.body.info).toBe("coding")
      });
  })
  test("200: returns subscribers count", () => {
    return request(app)
      .get("/api/topics/coding/subscriber_count")
      .expect(200)
      .then((response) => {
        expect(response.body.count).toBe(2)
      })
  })
})

describe("bad requests",() => {
  test("400: Bad Request when passed an id that is not valid", () => {
    return request(app)
      .get("/api/topics/banana/slug")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Bad Request");
      });
  });
  test("404: Not Found when given a number that exceeds the number of articles", () => {
    return request(app)
      .get("/api/topics/4454634/slug")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
  test("404: Not Found when passed an infoType that doesn't exist", () => {
    return request(app)
      .get("/api/topics/coding/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Invalid infoType");
      });
  });
});




