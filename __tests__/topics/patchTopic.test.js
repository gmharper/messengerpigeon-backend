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

describe("/api/topics/:slug", () => {
    const topic = {
      slug: "horses",
      created_by: 'lurker', 
      description: "Not dogs",
      subscribers: [],
      img_url: "",
      created_at: 1583025180000
    }

    test("200: Successfully patches the topic", () => {
      return request(app)
        .patch("/api/topics/coding")
        .send(topic)
        .expect(200)
        .then((response) => {
          //console.log(response.body.topic)
      })
    })
})

describe("/api/topics/:slug/:dataType", () => {
  test("200: patch the topic slug", () => {
    return request(app)
      .patch("/api/topics/coding/slug")
      .send({ data: "new_slug" })
      .expect(200)
      .then((response) => {
        expect(response.body.topic.slug).toEqual("new_slug")
      })
  })
  test("200: patch the topic description", () => {
    return request(app)
      .patch("/api/topics/coding/description")
      .send({ data: "new_description" })
      .expect(200)
      .then((response) => {
        expect(response.body.topic.description).toEqual("new_description")
      })
  })
  test("200: patch the topic img_url", () => {
    return request(app)
      .patch("/api/topics/coding/img_url")
      .send({ data: "new_img_url" })
      .expect(200)
      .then((response) => {
        expect(response.body.topic.img_url).toEqual("new_img_url")
      })
  })
  test("200: patch the topic subscribers", () => {
    return request(app)
      .patch("/api/topics/coding/subscribers")
      .send({ data: ["new_subscriber"] })
      .expect(200)
      .then((response) => {
        expect(response.body.topic.subscribers).toEqual(["new_subscriber"])
      })
  })
})

describe("errors /api/topics/:slug", () => {
    test("400: when sending an empty object", () => {
      return request(app)
          .patch("/api/topics/coding")
          .send({})
          .expect(400)
    })
    test("400: when sending a topic with missing properties", () => {
      return request(app)
        .patch("/api/topics/coding")
        .send({
          slug: "cats",
          created_by: 'lurker', 
          subscribers: [],
          img_url: "",
          created_at: 1583025180000
        })
        .expect(400)
        .then((response) => {
          //console.log(response.body.err_msg)
        })
    })
    test("400: when sending a topic with an empty description", () => {
      return request(app)
        .patch("/api/topics/coding")
        .send({
          slug: "cats",
          created_by: 'lurker', 
          description: "",
          subscribers: [],
          img_url: "",
          created_at: 1583025180000
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No description provided!")
        })
    })
})

xdescribe("errors /api/comments/:comment_id/:dataType", () => {

})