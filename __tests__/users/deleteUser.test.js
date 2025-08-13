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

//////////////////////////////
describe("DELETE /api/users/:username", () => {
    test("204: successfully deletes a user", () => {
        return request(app)
            .delete("/api/users/butter_bridge?dummy=false")
            .expect(200)
            .then((response) => {
                console.log(response.body)
            })
    })

    test("204: successfully deletes a user", () => {
        return request(app)
            .delete("/api/users/butter_bridge?dummy=true")
            .expect(200)
            .then((response) => {
                console.log(response.body)
            })
    })
})

describe("errors", () => {
    test("deleting a user that doesn't exist", () => {
        //
    })
})

