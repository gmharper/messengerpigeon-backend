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
describe("/api/topics", () => {
    const topic = {
        slug: "skydiving",
        created_by: 'lurker', 
        description: "Not dogs",
        subscribers: [],
        img_url: "",
        created_at: "2020-10-16T06:03:00.000Z"
    }

    test("200: Successfully posts a new topic", () => {
        return request(app)
            .post("/api/topics")
            .send(topic)
            .expect(201)
            .then((response) => {
                expect(response.body.topic).toEqual(expect.objectContaining({
                    slug: expect.any(String)
                }))
            })
    })
    test("200: Should still be valid if provided a topic with extra properties", () => {
        topic.blobby = "blobby blobby"
        return request(app)
            .post("/api/topics")
            .send(topic)
            .expect(201)
    })
})

/////////////////////////////
describe("errors", () => {
    test("400: When provided an empty object", () => {
        return request(app)
            .post("/api/topics")
            .send({})
            .expect(400)
    })

    test("400: When provided an array", () => {
        return request(app)
            .post("/api/topics")
            .send([])
            .expect(400)
    })

    test("400: When provided a non-object (string)", () => {
        return request(app)
            .post("/api/topics")
            .send("an invalid input")
            .expect(400)
    })

    test("400: When provided a topic with no slug property", () => {
        return request(app)
            .post("/api/topics")
            .send({
                created_by: 'lurker', 
                description: "Not dogs",
                subscribers: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided a topic with an empty slug", () => {
        return request(app)
            .post("/api/topics")
            .send({
                slug: "",
                created_by: 'lurker', 
                description: "Not dogs",
                subscribers: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
        
    })
    test("400: When provided a topic with no created_by property", () => {
        return request(app)
            .post("/api/topics")
            .send({
                slug: "cats",
                description: "Not dogs",
                subscribers: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided a topic with an empty created_by property", () => {
        return request(app)
            .post("/api/topics")
            .send({
                slug: "cats",
                created_by: '', 
                description: "Not dogs",
                subscribers: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
        
    })
    test("400: When provided a topic with no description property", () => {
        return request(app)
            .post("/api/topics")
            .send({
                slug: "cats",
                created_by: 'lurker', 
                subscribers: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided a topic with an empty description", () => {
        return request(app)
            .post("/api/topics")
            .send({
                slug: "cats",
                created_by: 'lurker', 
                description: "",
                subscribers: [],
                img_url: "",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
})