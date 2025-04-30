const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app/api.js");
const endpointsJson = require("../endpoints.json");
require("jest-sorted");

const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const comments = require("../db/data/test-data/comments.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

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

describe("GET /api/topics", () => {
  test("200: Responds with an object containing the topics with the slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        topics = response.body.topics;
        expect(topics[0]).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
            img_url: expect.any(String),
          })
        );
      });
  });
  test("404: Not Found error if entered an address that does not exist", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
  test("404: Not Found error if entered an address that is the wrong type", () => {
    return request(app)
      .get("/api/3845723957")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object containing the article corresponding to the article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Bad Request", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("400: Bad Request");
      });
  });
  test("404: Not Found", () => {
    return request(app)
      .get("/api/articles/678677867")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object containing all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              comment_count: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          ); // <--
        }); // <-- this is why I love javascript ;-;
      }); ///// <--
  });
  test("200: the articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe.only("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array with the comments objects", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
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
        console.log(response.body.comments);
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
  test("404: Not Found when passed something other than comments", () => {
    return request(app)
      .get("/api/articles/1/banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not Found");
      });
  });
});

// describe("POST a comment", () => {
//   const comment = { username: "gmharper", body: "a student at northcoders" };
//   return request(app)
//     .post("/api/articles/1/comments")
//     .send(comment)
//     .expect(201)
//     .then((response) => {
//       console.log(response.body)
//       expect(response.body.comment).toEqual({ 
//         username: "gmharper", body: "a student at northcoders" })
//     });
// });

// describe("PATCH an article", () => {
//   test("200: Successfully paches and returns the article", () => {
//     const votes = { inv_votes: 100 }
//     return request(app)
//       .post("/api/articles/1")
//       .send(votes)
//       .expect(200)
//       .then((response) => {
//         expect(response.body).toEqual(
//           expect.objectContaining({
//             comment_id: expect.any(Number),
//             votes: expect.any(Number),
//             created_at: expect.any(String),
//             author: expect.any(String),
//             body: expect.any(String),
//             article_id: expect.any(Number),
//           })
//         )
//     })
//   })
//   test("400: Bad Request when passed an id that is not valid", () => {
//     const votes = { inv_votes: 100 }
//     return request(app)
//     .post("/api/articles/banana")
//     .send(votes)
//     .expect(400)
//   })
//   test("404", () => {
//     const votes = { inc_votes: 100 }
//     return request(app)
//     .post("/api/articles/4325345")
//     .send(votes)
//     .expect(404)
//   })
//   test("400", () => {
//     const votes = { votes: 100 }
//     return request(app)
//     .post("/api/articles/1")
//     .send(votes)
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("400: Bad Request")
//     })
//   })
//   test("400", () => {
//     const votes = { inc_votes: not_a_number }
//     return request(app)
//     .post("/api/articles/1")
//     .send(votes)
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("400: Bad Request")
//     })
//   })
// })

// describe("200: get the users", () => {
//   return request(app)
//   .get("/api/users")
//   .expect(200)
//   .then((response) => {
//     expect(response.body).toEqual(
//       expect.objectContaining({
//         username: expect.any(String),
//         name: expect.any(String),
//         avatar_url: expect.any(String),
//       })
//     )
//   })
// })
