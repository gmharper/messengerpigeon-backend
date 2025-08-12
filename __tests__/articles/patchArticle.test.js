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

describe("/api/articles/:article_id", () => {
    const article = {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        comments: [],
        voted_by: [],
        img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        created_at: "2020-10-16T06:03:00.000Z"
    }

    test("200: Successfully patches the article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send(article)
        .expect(200)
        .then((response) => {
          expect(response.body.article.title).toBe("Sony Vaio; or, The Laptop")
        })
    })
})

describe("/api/articles/:article_id/:dataType", () => {
    test("200: patch the article title", () => {
      return request(app)
        .patch("/api/articles/1/title")
        .send({ data: "new_title" })
        .expect(200)
        .then((response) => {
          expect(response.body.article.title).toBe("new_title")
        })
    })
    test("200: patch the article voted_by", () => {
      return request(app)
        .patch("/api/articles/1/voted_by")
        .send({ data: ["gmharper"] })
        .expect(200)
        .then((response) => {
          expect(response.body.article.voted_by).toEqual(["gmharper"])
        })
    })
})

describe("errors /api/articles/:article_id", () => {
    test("400: when sending an empty object", () => {
      return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
    })
    test("400: when sending an article with missing properties", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          topic: "mitch",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          comments: [],
          voted_by: [],
          img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          created_at: "2020-10-16T06:03:00.000Z"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No title provided!")
        })
    })
    test("400: when sending an article with an empty title", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          title: "",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          comments: [],
          voted_by: [],
          img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          created_at: "2020-10-16T06:03:00.000Z"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No title provided!")
        })
    })
    test("400: when sending an article with an empty body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "",
        comments: [],
        voted_by: [],
        img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        created_at: "2020-10-16T06:03:00.000Z"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No body provided!")
        })
    })
    test("400: when sending an article with an empty author", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        comments: [],
        voted_by: [],
        img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        created_at: "2020-10-16T06:03:00.000Z"
        })
        .expect(400)
        .then((response) => {
          expect(response.body.err_msg).toBe("No author provided!")
        })
    })
})

xdescribe("errors /api/articles/:article_id/:dataType", () => {

})