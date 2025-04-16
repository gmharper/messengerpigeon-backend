const db = require("../connection");
const format = require("pg-format");

const utils = require("../seeds/utils");

const createRef = utils.getArticleIdFromTitle;

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS topics;`
    )
    .then(() => {
      return db.query(
        `CREATE TABLE topics(
        description VARCHAR, 
        slug VARCHAR PRIMARY KEY, 
        img_url VARCHAR(1000)
        );

        CREATE TABLE users(
        username VARCHAR PRIMARY KEY, 
        name VARCHAR, 
        avatar_url VARCHAR(1000)
        );

        CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY, 
        title VARCHAR, 
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username), 
        body TEXT, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        votes INT DEFAULT 0, 
        article_img_url VARCHAR(1000)
        );

        CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        article_title VARCHAR,
        body TEXT, 
        votes INT DEFAULT 0, 
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
      );
    })
    .then(() => {
      const formattedTopicData = topicData.map((data) => {
        return [data.description, data.slug, data.img_url];
      });
      const topics = format(
        "INSERT INTO topics(description, slug, img_url) VALUES %L",
        formattedTopicData
      );
      return db.query(topics);
    })
    .then(() => {
      const formattedUserData = userData.map((userDatas) => {
        return [userDatas.username, userDatas.name, userDatas.avatar_url];
      });
      const users = format(
        "INSERT INTO users(username, name, avatar_url) VALUES %L",
        formattedUserData
      );
      return db.query(users);
    })
    .then(() => {
      const formattedArticleData = articleData.map((articleDatas) => {
        return [
          articleDatas.title,
          articleDatas.topic,
          articleDatas.author,
          articleDatas.body,
          (articleDatas.created_at = new Date(articleDatas.created_at)),
          articleDatas.votes,
          articleDatas.article_img_url,
        ];
      });
      const articles = format(
        "INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *",
        formattedArticleData
      );
      return db.query(articles);
    })
    .then((result) => {
      const articlesRefObj = createRef(result.rows);
      const formattedCommentData = commentData.map((comment) => {
        return [
          articlesRefObj[comment.article_title],
          comment.article_title,
          comment.body,
          comment.author,
          comment.votes,
          (comment.created_at = new Date(comment.created_at)),
        ];
      });
      const comments = format(
        "INSERT INTO comments(article_id, article_title, body, author, votes, created_at) VALUES %L",
        formattedCommentData
      );
      return db.query(comments);
    });
};

module.exports = seed;
