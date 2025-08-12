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

describe("/api/comments/:comment_id", () => {
    const comment = {
      article_id: 1,
      article_title: "Living in the shadow of a great man",
      author: "icellusedkars",
      body: "I hate streaming eyes even more",
      voted_by: [],
      created_at: 1586642520000,
    }

    test("200: Successfully patches the comment", () => {
        return request(app)
            .patch("/api/comments/1")
            .send(comment)
            .expect(200)
            .then((response) => {
              expect(response.body.comment.body).toEqual("I hate streaming eyes even more")
            })
    })
})

describe("/api/comments/:comment_id/:dataType", () => {
    test("200: patch the comment body", () => {
      return request(app)
        .patch("/api/comments/1/body")
        .send({ data: "new_body" })
        .expect(200)
        .then((response) => {
          expect(response.body.comment.body).toEqual("new_body")
        })
    })
    test("200: patch the comment voted_by", () => {
      return request(app)
        .patch("/api/comments/1/voted_by")
        .send({ data: ["gmharper"] })
        .expect(200)
        .then((response) => {
          expect(response.body.comment.voted_by).toEqual(["gmharper"])
        })
    })
})

describe("errors /api/comments/:comment_id", () => {
    test("400: when sending an empty object", () => {
      return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(400)
    })
    test("400: when sending a comment with missing properties", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          article_id: 1,
          article_title: "Living in the shadow of a great man",
          voted_by: [],
          created_at: 1586642520000,
        })
        .expect(400)
        .then((response) => {
          //console.log(response.body.err_msg)
        })
    })
    test("400: when sending a comment with an empty body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          article_id: 1,
          article_title: "Living in the shadow of a great man",
          author: "icellusedkars",
          body: "",
          voted_by: [],
          created_at: 1586642520000,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No body provided!")
        })
    })
    test("400: when sending a comment with an empty author", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          article_id: 1,
          article_title: "Living in the shadow of a great man",
          author: "",
          body: "I hate streaming eyes even more",
          voted_by: [],
          created_at: 1586642520000,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No author provided!")
        })
    })
})

xdescribe("errors /api/comments/:comment_id/:dataType", () => {

})