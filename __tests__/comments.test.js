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

///////////////////////////////////////////
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
              article_id: expect.any(Number),
              article_title: expect.any(String),
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
});

// ///////////////////////////////////////////
// describe("POST /api/comments", () => {
//   test("200", () => {
//     const comment = {
//       username: "icellusedkars",
//       body: "student at northcoders",
//     };
//     return request(app)
//       .post("/api/comments")
//       .send(comment)
//       .expect(200)
//       .then((response) => {
//         const comment = response;
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

///////////////////////////////////////////
describe("PATCH /api/commments/:comment_id", () => {
  test("200", () => {
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("All OK from PATCH /api/comments/1");
      });
  });
});

///////////////////////////////////////////
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE from comments", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then((response) => {
        expect(response.res.statusMessage).toBe("No Content");
        expect(response.noContent).toBe(true);
      });
  });
});
