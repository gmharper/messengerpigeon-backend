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

//////////////////////////////////////
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

// //////////////////////////////////////
// describe("POST /api/topics", () => {
//   const topic = {
//     slug: "",
//     description: "",
//   };
//   test("201: successfully posts the new topic", () => {
//     return request(app)
//       .post("/api/topics")
//       .send(topic)
//       .expect(201)
//       .then((response) => {
//         expect(response.body.topic).toBe(
//           expect.objectContaining({
//             slug: expect.any(String),
//             description: expect.any(String),
//           })
//         );
//       });
//   });
// });
