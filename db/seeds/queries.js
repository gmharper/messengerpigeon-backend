const db = require("../connection");
const seed = require("../seeds/seed");
const devData = require("../../db/data/development-data/index");

// console.log(devData.userData.length);
// console.log(devData.topicData.length);
// console.log(devData.commentData.length);
// console.log(devData.articleData.length);
// seed(devData).then(() => db.end());

const usersQuery = db.query(`SELECT * FROM users;`).then((result) => {
  return result;
});

const codingTopicsQuery = db
  .query(`SELECT * FROM articles WHERE topic='coding';`)
  .then((result) => {
    return result;
  });

const votesLessThanZeroQuery = db
  .query(`SELECT * FROM comments WHERE votes<0;`)
  .then((result) => {
    return result;
  });

const topicsQuery = db.query(`SELECT * FROM topics;`).then((result) => {
  return result;
});

const grumpyQuery = db
  .query(`SELECT * from articles WHERE author='grumpy19';`)
  .then((result) => {
    return result;
  });

const votesMoreThanTenQuery = db
  .query(`SELECT * FROM comments WHERE votes > 10;`)
  .then((result) => {
    return result;
  });

module.exports = {
  usersQuery,
  codingTopicsQuery,
  votesLessThanZeroQuery,
  topicsQuery,
  grumpyQuery,
  votesMoreThanTenQuery,
};
