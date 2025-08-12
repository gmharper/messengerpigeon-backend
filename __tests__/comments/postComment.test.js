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

//////////////////////////
describe("/api/comments", () => {
    const comment = {
        article_id: 1,
        article_title: "Living in the shadow of a great man",
        author: "butter_bridge",
        body: "This morning, I showered for nine minutes.",
        voted_by: [],
        img_url: "",
        created_at: "2020-10-16T06:03:00.000Z",
    }

    test("200: Successfully posts a new comment", () => {
        return request(app)
            .post("/api/comments")
            .send(comment)
            .expect(201)
            .then((response) => {
                expect(response.body.comment).toEqual(expect.objectContaining({
                    body: expect.any(String)
                }))
            })
    })
    test("200: Should still be valid if provided a comment with extra properties", () => {
        comment.blobby = "blobby blobby"
        return request(app)
            .post("/api/comments")
            .send(comment)
            .expect(201)
    })
})

/////////////////////////////
describe("errors", () => {
    test("400: When provided an empty object", () => {
        return request(app)
            .post("/api/comments")
            .send({})
            .expect(400)
    })

    test("400: When provided an array", () => {
        return request(app)
            .post("/api/comments")
            .send([])
            .expect(400)
    })

    test("400: When provided a non-object (string)", () => {
        return request(app)
            .post("/api/comments")
            .send("an invalid input")
            .expect(400)
    })

    test("400: When provided a comment with no author property", () => {
        return request(app)
            .post("/api/comments")
            .send({
                article_id: 0,
                article_title: "Living in the shadow of a great man",
                body: "This morning, I showered for nine minutes.",
                voted_by: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z",
            })
            .expect(400)
    })
    test("400: When provided a comment with an empty author", () => {
        return request(app)
            .post("/api/comments")
            .send({
                article_id: 0,
                article_title: "Living in the shadow of a great man",
                author: "",
                body: "This morning, I showered for nine minutes.",
                voted_by: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z",
            })
            .expect(400)
        
    })
    test("400: When provided a comment with no body property", () => {
        return request(app)
            .post("/api/comments")
            .send({
                article_id: 0,
                article_title: "Living in the shadow of a great man",
                author: "butter_bridge",
                voted_by: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z",
            })
            .expect(400)
    })
    test("400: When provided a comment with an empty body", () => {
        return request(app)
            .post("/api/comments")
            .send({
                article_id: 0,
                article_title: "Living in the shadow of a great man",
                author: "butter_bridge",
                body: "",
                voted_by: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z",
            })
            .expect(400)
    })
})