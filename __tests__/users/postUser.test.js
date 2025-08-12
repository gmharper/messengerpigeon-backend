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
describe("/api/users", () => {
    const user = {
        username: "butter_bridge2",
        name: "jonny",
        email: "",
        description: "Here's Jonny",
        profile_colour: "blue",
        avatar_img_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        banner_img_url: "",
        articles: ["butter_bridge's article"],
        comments: ["hello this is a comment"],
        subscribed_topics: [],
        followers: [],
        following: [],
        voted_articles: [],
        voted_comments: [],
        created_at: 1583025180000
    }

    test("200: Successfully posts a new user", () => {
        return request(app)
            .post("/api/users")
            .send(user)
            .expect(201)
            .then((response) => {
                expect(response.body.topic).toEqual(expect.objectContaining({
                    slug: expect.any(String)
                }))
            })
    })
    test("200: Should still be valid if provided a user with extra properties", () => {
        user.blobby = "blobby blobby"
        return request(app)
            .post("/api/users")
            .send(topic)
            .expect(201)
    })
})

/////////////////////////////
describe("errors", () => {
    test("400: When provided an empty object", () => {
        return request(app)
            .post("/api/users")
            .send({})
            .expect(400)
    })

    test("400: When provided an array", () => {
        return request(app)
            .post("/api/users")
            .send([])
            .expect(400)
    })

    test("400: When provided a non-object (string)", () => {
        return request(app)
            .post("/api/users")
            .send("an invalid input")
            .expect(400)
    })

    test("400: When provided a user with no username property", () => {
        return request(app)
            .post("/api/users")
            .send({
                name: "jonny",
                email: "",
                description: "Here's Jonny",
                profile_colour: "blue",
                avatar_img_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                banner_img_url: "",
                articles: ["butter_bridge's article"],
                comments: ["hello this is a comment"],
                subscribed_topics: [],
                followers: [],
                following: [],
                voted_articles: [],
                voted_comments: [],
                created_at: 1583025180000
            })
            .expect(400)
    })
    test("400: When provided a user with an empty username", () => {
        return request(app)
            .post("/api/users")
            .send({
                username: "",
                name: "jonny",
                email: "",
                description: "Here's Jonny",
                profile_colour: "blue",
                avatar_img_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                banner_img_url: "",
                articles: ["butter_bridge's article"],
                comments: ["hello this is a comment"],
                subscribed_topics: [],
                followers: [],
                following: [],
                voted_articles: [],
                voted_comments: [],
                created_at: 1583025180000
            })
            .expect(400)
        
    })
    test("400: When provided a topic with no created_by property", () => {
        return request(app)
            .post("/api/users")
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
            .post("/api/users")
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
            .post("/api/users")
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
            .post("/api/user")
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