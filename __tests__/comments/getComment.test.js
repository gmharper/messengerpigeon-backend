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
describe("GET /api/comments", () => {
  test("200: returns the comments", () => {
    return request(app)
      .get("/api/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;

        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: expect.any(Number),
              article_title: expect.any(String),
              type: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              voted_by: expect.any(Array),
              created_at: expect.any(String)
            })
          );
        });
      });
  });
});

///////////////////////////////////////
describe("GET /api/comments/data", () => {
  test("200: returns the comment IDs", () => {
    return request(app)
      .get("/api/comments/data/comment_id")
      .expect(200)
      .then((response) => {
        //console.log(response.body)
      })
  })

  test("200: returns the comment bodies", () => {
    return request(app)
      .get("/api/comments/data/body")
      .expect(200)
      .then((response) => {
        //console.log(response.body)
      })
  })

  test("200: returns the comments voted_by", () => {
    return request(app)
      .get("/api/comments/data/voted_by")
      .expect(200)
      .then((response) => {
        //console.log(response.body)
      })
  })
})

///////////////////////////////////////
describe("GET /api/comments/:comment_id", () => {
  test("200: returns the comment object", () => {
    return request(app)
      .get("/api/comments/3")
      .expect(200)
      .then((response) => {
        console.log(response.body.comment)
      });
  })
})

///////////////////////////////////////
describe("GET /api/comments/:comment_id/:dataType", () => {
  test("200: returns an array with the specific data", () => {
    return request(app)
      .get("/api/comments/2/voted_by")
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual([])
      });
  })
  test("200: returns voted_by array", () => {
    return request(app)
      .get("/api/comments/3/voted_by")
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual([])
      })
  })
  test("200: returns vote count", () => {
    return request(app)
      .get("/api/comments/3/votes_count")
      .expect(200)
      .then((response) => {
        expect(response.body.count).toBe(0)
      })
  })
  test("200: returns available commentdata endpoints", () => {
    return request(app)
      .get("/api/comments/0/endpoints")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(
          [
            "comment_id", "article_id", "article_title", "author", "body", "voted_by", "created_at",
            "votes_count"
        ]
        )
      })
  })
})

describe("bad requests",() => {
  test("400: VERY bad request", () => {
    return request(app)
      .get("/api/comments/DROP TABLE IF EXISTS comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Bad Request");
      });
  });

  test("400: VERY bad request", () => {
    return request(app)
      .get("/api/comments/1/DROP TABLE IF EXISTS comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Invalid dataType");
      });
  });

  test("400: Bad Request when passed an id that is not valid", () => {
    return request(app)
      .get("/api/comments/banana/body")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Bad Request");
      });
  });
  test("404: Not Found when given a number that exceeds the number of articles", () => {
    return request(app)
      .get("/api/comments/4454634/body")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
  test("404: Not Found when passed an infoType that doesn't exist", () => {
    return request(app)
      .get("/api/comments/1/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Invalid dataType");
      });
  });
});

