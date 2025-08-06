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
describe("GET /api/articles", () => {
  test("200: returns the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              type: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              title: expect.any(String),
              body: expect.any(String),
              comments: expect.any(Array),
              voted_by: expect.any(Array),
              img_url: expect.any(String),
              created_at: expect.any(String)
            })
          );
        });
      });
  });
});

///////////////////////////////////////
describe("GET /api/articles/:article_id", () => {
  test("200: returns the article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        console.log(response.body.article)
      });
  })
})

///////////////////////////////////////
describe("GET /api/articles/:article_id/:infoType", () => {
  test("200: returns an array with the comments objects", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.info.length).toBe(3)
      });
  })
  test("200: returns comment count", () => {
    return request(app)
      .get("/api/articles/3/comment_count")
      .expect(200)
      .then((response) => {
        expect(response.body.count).toBe(3)
      })
  })
  test("200: returns vote count", () => {
    return request(app)
      .get("/api/articles/3/vote_count")
      .expect(200)
      .then((response) => {
        expect(response.body.count).toBe(2)
      })
  })
})

describe("bad requests",() => {
  test("400: Bad Request when passed an id that is not valid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Bad Request");
      });
  });
  test("404: Not Found when given a number that exceeds the number of articles", () => {
    return request(app)
      .get("/api/articles/4454634/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
  test("404: Not Found when passed an infoType that doesn't exist", () => {
    return request(app)
      .get("/api/articles/1/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Invalid infoType");
      });
  });
});

