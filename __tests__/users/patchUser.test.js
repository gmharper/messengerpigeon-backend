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

describe("/api/users/:username", () => {
    const user =   {
    username: "new_username",
    name: "new_name",
    email: "new_email",
    description: "This is a new user",
    profile_colour: "blue",
    avatar_img_url:
      "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    banner_img_url: "",
    banner_blend: "multiply",
    banner_position: "top",
    articles: ["butter_bridge's article"],
    comments: ["hello this is a comment"],
    subscribed_topics: [],
    followers: [],
    following: [],
    voted_articles: [],
    voted_comments: [],
    created_at: 1583025180000
  }

    test("200: Successfully patches the user", () => {
      return request(app)
        .patch("/api/users/butter_bridge")
        .send(user)
        .expect(200)
        .then((response) => {
          expect(response.body.user.username).toBe("butter_bridge")
          expect(response.body.user.name).toBe("new_name")
          expect(response.body.user.email).toBe("new_email")
          expect(response.body.user.description).toBe("This is a new user")
          expect(response.body.user.banner_blend).toBe("multiply")
          expect(response.body.user.banner_position).toBe("top")
      })
    })
})

describe.only("/api/users/:username/:dataType", () => {
  test("200: patch the users name", () => {
    return request(app)
      .patch("/api/users/butter_bridge/name")
      .send({ data: "new_name" })
      .expect(200)
      .then((response) => {
        expect(response.body.user.name).toBe("new_name")
      })
  })
  test("200: patch the users description", () => {
    return request(app)
      .patch("/api/users/butter_bridge/description")
      .send({ data: "new_description" })
      .expect(200)
      .then((response) => {
        expect(response.body.user.description).toBe("new_description")
      })
  })
  test("200: patch the user profile_colour", () => {
    return request(app)
      .patch("/api/users/butter_bridge/profile_colour")
      .send({ data: "green" })
      .expect(200)
      .then((response) => {
        expect(response.body.user.profile_colour).toBe("green")
      })
  })
  test("200: patch the user avatar_img_url", () => {
    return request(app)
      .patch("/api/users/butter_bridge/avatar_img_url")
      .send({ data: "new_avatar_img_url" })
      .expect(200)
      .then((response) => {
        expect(response.body.user.avatar_img_url).toBe("new_avatar_img_url")
      })
  })
  test("200: patch the user banner_img_url", () => {
    return request(app)
      .patch("/api/users/butter_bridge/banner_img_url")
      .send({ data: "new_banner_img_url" })
      .expect(200)
      .then((response) => {
        expect(response.body.user.banner_img_url).toBe("new_banner_img_url")
      })
  })
  test("200: patch the user articles", () => {
    return request(app)
      .patch("/api/users/butter_bridge/articles")
      .send({ data: ["new_article_id"] })
      .expect(200)
      .then((response) => {
        expect(response.body.user.articles).toEqual(["new_article_id"])
      })
  })
  test("200: patch the user comments", () => {
    return request(app)
      .patch("/api/users/butter_bridge/comments")
      .send({ data: ["new_comment_id"] })
      .expect(200)
      .then((response) => {
        expect(response.body.user.comments).toEqual(["new_comment_id"])
      })
  })
  test("200: patch the user followers", () => {
    return request(app)
      .patch("/api/users/butter_bridge/followers")
      .send({ data: ["new_username"] })
      .expect(200)
      .then((response) => {
        expect(response.body.user.followers).toEqual(["new_username"])
      })
  })
  test("200: patch the user following", () => {
    return request(app)
      .patch("/api/users/butter_bridge/following")
      .send({ data: ["new_username"] })
      .expect(200)
      .then((response) => {
        expect(response.body.user.following).toEqual(["new_username"])
      })
  })
})

xdescribe("errors /api/users/:username", () => {
    test("400: when sending an empty object", () => {
      return request(app)
          .patch("/api/users/butter_bridge")
          .send({})
          .expect(400)
    })
    test("400: when sending a user with missing properties", () => {
      return request(app)
        .patch("/api/users/butter_bridge")
        .send()
        .expect(400)
        .then((response) => {
          //console.log(response.body.err_msg)
        })
    })
    test("400: when sending a topic with an empty description", () => {
      return request(app)
        .patch("/api/users/butter_bridge")
        .send()
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No description provided!")
        })
    })
})

xdescribe("errors /api/comments/:comment_id/:dataType", () => {

})