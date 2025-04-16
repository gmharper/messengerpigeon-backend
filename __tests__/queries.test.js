const db = require("../db/connection");
const queries = require("../db/seeds/queries");
const seed = require("../db/seeds/seed");
const devData = require("../db/data/development-data/index");

// beforeAll(() => seed(devData));
// afterAll(() => db.end());

describe("queries", () => {
  //   test("query all of the users", () => {
  //     const users = [
  //       {
  //         username: "tickle122",
  //         name: "Tom Tickle",
  //         avatar_url:
  //           "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  //       },
  //       {
  //         username: "grumpy19",
  //         name: "Paul Grump",
  //         avatar_url:
  //           "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
  //       },
  //       {
  //         username: "happyamy2016",
  //         name: "Amy Happy",
  //         avatar_url:
  //           "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
  //       },
  //       {
  //         username: "cooljmessy",
  //         name: "Peter Messy",
  //         avatar_url:
  //           "https://vignette.wikia.nocookie.net/mrmen/images/1/1a/MR_MESSY_4A.jpg/revision/latest/scale-to-width-down/250?cb=20170730171002",
  //       },
  //       {
  //         username: "weegembump",
  //         name: "Gemma Bump",
  //         avatar_url:
  //           "https://vignette.wikia.nocookie.net/mrmen/images/7/7e/MrMen-Bump.png/revision/latest?cb=20180123225553",
  //       },
  //       {
  //         username: "jessjelly",
  //         name: "Jess Jelly",
  //         avatar_url:
  //           "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
  //       },
  //     ];
  //     queries.usersQuery.then((result) => {
  //       expect(result.rows).toEqual(users);
  //     });
  //   });
  //   test("query all of the topics where the topic is coding", () => {
  //     queries.codingTopicsQuery.then((result) => {
  //       expect(result.rows.length).not.toEqual(37);
  //       expect(result.rows.length).toEqual(12);
  //     });
  //   });
  //   test("query all of the comments where votes are less than zero", () => {
  //     queries.votesLessThanZeroQuery.then((result) => {
  //       expect(result.rows.length).not.toEqual(300); //the original length
  //       expect(result.rows.length).toEqual(63);
  //     });
  //   });
  test("query all of the topics", () => {});
  test("query all of the articles by user grumpy19", () => {});
  test("query all of the comments that have more than 10 votes", () => {});
});
