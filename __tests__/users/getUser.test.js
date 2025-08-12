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
describe("GET /api/users", () => {
  test("200: returns the users", () => {
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
              email: expect.any(String),
              type: expect.any(String),
              description: expect.any(String),
              profile_colour: expect.any(String),
              avatar_img_url: expect.any(String),
              banner_img_url: expect.any(String),
              articles: expect.any(Array),
              comments: expect.any(Array),
              subscribed_topics: expect.any(Array),
              followers: expect.any(Array),
              following: expect.any(Array),
              voted_articles: expect.any(Array),
              voted_comments: expect.any(Array),
              created_at: expect.any(String)
            })
          );
        });
      });
  });
});

///////////////////////////////////////
describe("GET /api/users/:username", () => {
  test("200: returns the article object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        //console.log(response.body.user)
      });
  })
})

///////////////////////////////////////
describe("GET /api/users/:username/:infoType", () => {
  test("200: returns an array with the article object", () => {
    return request(app)
      .get("/api/users/butter_bridge/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual(["butter_bridge's article"])
      });
  })
  test("200: returns the description", () => {
    return request(app)
      .get("/api/users/butter_bridge/description")
      .expect(200)
      .then((response) => {
        expect(response.body.data).toBe("Here's Jonny")
      });
  })
  test("200: returns comment count", () => {
    return request(app)
      .get("/api/users/butter_bridge/comments_count")
      .expect(200)
      .then((response) => {
        expect(response.body.count).toEqual(1)
      })
  })
  test("200: returns followers", () => {
    return request(app)
      .get("/api/users/butter_bridge/followers")
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual([])
      })
  })
  test("200: returns following", () => {
    return request(app)
      .get("/api/users/butter_bridge/following")
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual([])
      })
  })
  test("200: returns available userdata endpoints", () => {
    return request(app)
      .get("/api/users/1/endpoints")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(
          [
            "username", "name", "email", "description",
            "profile_colour", "avatar_img_url", "banner_img_url",
            "articles", "comments", "subscribed_topics",
            "followers", "following",
            "voted_articles", "voted_comments",
            "created_at",
            "articles_count", "comments_count", "subscribed_topics_count", 
            "followers_count", "following_count",
            "voted_articles_count", "voted_comments_count"
        ]
        )
      })
  })

})

describe("bad requests",() => {
  test("400: Bad Request when passed an id that is not valid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.err_msg).toBe("400: Bad Request");
      });
  });
  test("404: Not Found when given a number that exceeds the number of articles", () => {
    return request(app)
      .get("/api/articles/4454634/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.err_msg).toBe("404: Not Found");
      });
  });
  test("404: Not Found when passed an infoType that doesn't exist", () => {
    return request(app)
      .get("/api/articles/1/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.err_msg).toBe("400: Invalid dataType");
      });
  });
});