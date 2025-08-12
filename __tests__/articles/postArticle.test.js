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
describe("/api/articles", () => {
    const article = {
        article_id: 14,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        type: "article",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        comments: [],
        voted_by: [],
        img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        created_at: "2020-10-16T06:03:00.000Z"
    }

    test("200: Successfully posts a new article", () => {
        return request(app)
            .post("/api/articles")
            .send(article)
            .expect(201)
            .then((response) => {
                expect(response.body.article).toEqual(expect.objectContaining({
                    title: expect.any(String)
                }))
            })
    })
    test("200: Should still be valid if provided an article with extra properties", () => {
        article.blobby = "blobby blobby"
        return request(app)
            .post("/api/articles")
            .send(article)
            .expect(201)
    })
})

/////////////////////////////
describe("errors", () => {
    test("400: When provided an empty object", () => {
        return request(app)
            .post("/api/articles")
            .send({})
            .expect(400)
    })

    test("400: When provided an array", () => {
        return request(app)
            .post("/api/articles")
            .send([])
            .expect(400)
    })

    test("400: When provided a non-object (number)", () => {
        return request(app)
            .post("/api/articles", 4)
            .expect(400)
    })

    test("400: When provided a non-object (string)", () => {
        return request(app)
            .post("/api/articles", "an invalid input")
            .expect(400)
    })

    test("400: When provided an article with no title property", () => {
        return request(app)
            .post("/api/articles")
            .send({
                article_id: 14,
                topic: "mitch",
                type: "article",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                comments: [],
                voted_by: [],
                img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided an article with an empty title", () => {
        return request(app)
            .post("/api/articles")
            .send({
                article_id: 14,
                title: "",
                topic: "mitch",
                type: "article",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                comments: [],
                voted_by: [],
                img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided an article with no author property", () => {
        return request(app)
            .post("/api/articles")
            .send({
                article_id: 14,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                type: "article",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                comments: [],
                voted_by: [],
                img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided an article with an empty author", () => {
        return request(app)
            .post("/api/articles")
            .send({
                article_id: 14,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                type: "article",
                author: "",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                comments: [],
                voted_by: [],
                img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
        
    })
    test("400: When provided an article with no body property", () => {
        return request(app)
            .post("/api/articles")
            .send({
                article_id: 14,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                type: "article",
                author: "icellusedkars",
                comments: [],
                voted_by: [],
                img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
    test("400: When provided an article with an empty body", () => {
        return request(app)
            .post("/api/articles")
            .send({
                article_id: 14,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                type: "article",
                author: "icellusedkars",
                body: "",
                comments: [],
                voted_by: [],
                img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: "2020-10-16T06:03:00.000Z"
            })
            .expect(400)
    })
})