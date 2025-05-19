const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app/api.js");
require("jest-sorted");

const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

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
              topic: expect.any(String),
              author: expect.any(String),
              title: expect.any(String),
              comment_count: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
});

/////////////////////////////////////////
describe("GET /api/articles/:article_id/comments", () => {
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

// //////////////////////////////////////////
// describe("/api/articles/:article_id/comments", () => {
//   test("POST a comment", () => {
//     const comment = {
//       username: "icellusedkars",
//       body: "student at northcoders",
//     };
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({
//         username: "icellusedkars",
//         body: "student at northcoders",
//       })
//       .expect(201)
//       .then((response) => {
//         const comment = response.body.comment;
//         expect(comment).toEqual(
//           expect.objectContaining({
//             comment_id: expect.any(Number),
//             votes: expect.any(Number),
//             created_at: expect.any(String),
//             author: "icellusedkars",
//             body: "student at northcoders",
//             article_id: expect.any(Number),
//           })
//         );
//       });
//   });
// });

// test("400: Bad Request when passed an id that is not valid", () => {
//   const votes = { inc_votes: 100 };
//   return request(app).patch("/api/articles/banana").send(votes).expect(400);
// });
// test("404", () => {
//   const votes = { inc_votes: 100 };
//   return request(app).patch("/api/articles/4325345").send(votes).expect(404);
// });
// test("400", () => {
//   const votes = { votes: 100 };
//   return request(app)
//     .patch("/api/articles/1")
//     .send(votes)
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("400: Bad Request");
//     });
// });
// test("400", () => {
//   const votes = { inc_votes: "not_a_number" };
//   return request(app)
//     .patch("/api/articles/1")
//     .send(votes)
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("400: Bad Request");
//     });
// });
// test("400", () => {
//   const votes = {};
//   return request(app)
//     .patch("/api/articles/1")
//     .send(votes)
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("400: Bad Request");
//     });
// });

// /////////////////////////////////////////
// describe("PATCH /api/articles/:article_id", () => {
//   test("200: Successfully patches and returns the article", () => {
//     const votes = { inc_votes: 100 };
//     return request(app)
//       .patch("/api/articles/1")
//       .send(votes)
//       .expect(200)
//       .then((response) => {
//         const article = response.body.article;
//         expect(article).toEqual(
//           expect.objectContaining({
//             article_id: expect.any(Number),
//             article_img_url: expect.any(String),
//             title: expect.any(String),
//             topic: expect.any(String),
//             votes: expect.any(Number),
//             created_at: expect.any(String),
//             author: expect.any(String),
//             body: expect.any(String),
//           })
//         );
//         expect(article.votes).toEqual(200);
//       });
//   });

////////////////////////////////////////////////
describe("GET /api/articles?sort_by&order", () => {
  const validSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
    "created_at",
  ];
  const validOrders = ["ASC", "DESC"];

  test("200: returns the articles sorted by the custom query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("author", { ascending: true });
      });
  });
  // test("200: test for all sorts & orders", () => {
  //   validSorts.forEach((sort) => {
  //     validOrders.forEach((order) => {
  //       return request(app)
  //         .get(`/api/articles?sort_by=${sort}&order=${order}`)
  //         .expect(200)
  //         .then((response) => {
  //           console.log(sort, order);
  //         });
  //     });
  //   });
  // });
  test("400: returns an error if given an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas&order=ASC")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Sort");
      });
  });
  test("400: returns an error if given an invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ascending")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Order");
      });
  });
});

///////////////////////////////////////////
describe("GET /api/articles?topic", () => {
  test("200", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        return;
      });
  });
  test("400: When passed an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Topic");
      });
  });
  test("400: When passed an invalid query parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC&wrongquery=mitch")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Query");
      });
  });
});

// ////////////////////////////////////////////
// describe("DELETE /api/articles/:article_id", () => {
//   test("204: successfully deletes the article", () => {
//     return request(app).delete("/api/articles/1").expect(204);
//   });
// });
