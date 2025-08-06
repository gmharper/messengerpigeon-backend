const db = require("../connection");
const format = require("pg-format");

const utils = require("../seeds/utils");

const createRef = utils.getArticleIdFromTitle;

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS topics;
      DROP TABLE IF EXISTS users;`
    )
    .then(() => {
      return db.query(
        `CREATE TABLE users(
        username VARCHAR(50) PRIMARY KEY,
        type VARCHAR(10) DEFAULT 'user', 
        name VARCHAR(50),
        email VARCHAR(100),
        description VARCHAR(200),
        profile_colour VARCHAR(200), 
        avatar_img_url VARCHAR(200),
        banner_img_url VARCHAR(200),
        articles VARCHAR[],
        comments VARCHAR[],
        subscribed_topics VARCHAR[],
        followers VARCHAR[],
        following VARCHAR[],
        voted_articles VARCHAR[],
        voted_comments VARCHAR[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE topics(
        slug VARCHAR(50) PRIMARY KEY,
        type VARCHAR(10) DEFAULT 'topic',
        creator VARCHAR REFERENCES users(username), 
        description VARCHAR(200), 
        subscribers VARCHAR[],
        img_url VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY,
        type VARCHAR(10) DEFAULT 'article',
        title VARCHAR, 
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username), 
        body TEXT, 
        voted_by VARCHAR[],
        comments VARCHAR[], 
        img_url VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        type VARCHAR(10) DEFAULT 'comment',
        article_id INT REFERENCES articles(article_id),
        article_title VARCHAR,
        author VARCHAR REFERENCES users(username),
        body TEXT, 
        voted_by VARCHAR[], 
        img_url VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
      );
    })
    .then(() => {
      const formattedUserData = userData.map((userDatas) => {
        return [
          userDatas.username, userDatas.name, userDatas.email,
          userDatas.description, 
          userDatas.profile_colour, userDatas.avatar_img_url, userDatas.banner_img_url,
          `{ ${userDatas.articles.map(item => item)} }`,
          `{ ${userDatas.comments.map(item => item)} }`,
          `{ ${userDatas.followers.map(item => item)} }`,
          `{ ${userDatas.following.map(item => item)} }`,
          `{ ${userDatas.voted_articles.map(item => item)} }`,
          `{ ${userDatas.voted_comments.map(item => item)} }`,
          new Date(userDatas.created_at)];
      });
      const users = format(
        "INSERT INTO users(username, name, email, description, "+
        "profile_colour, avatar_img_url, banner_img_url, "+
        "articles, comments, followers, following, "+
        "voted_articles, voted_comments, created_at) VALUES %L;",
        formattedUserData
      );
      return db.query(users);
    })
    .then(() => {
      const formattedTopicData = topicData.map((topicDatas) => {
        return [
          topicDatas.slug, 
          topicDatas.creator, topicDatas.description, 
          `{ ${topicDatas.subscribers.map(item => item)} }`,
          topicDatas.img_url, 
          new Date(topicDatas.created_at)];
      });
      const topics = format(
        "INSERT INTO topics(slug, creator, description, subscribers, img_url, created_at) VALUES %L;",
        formattedTopicData
      );
      return db.query(topics);
    })

    .then(() => {
      const formattedArticleData = articleData.map((articleDatas) => {
        return [
          articleDatas.title,
          articleDatas.topic, articleDatas.author, articleDatas.body,
          `{ ${articleDatas.comments.map(item => item)} }`, 
          `{ ${articleDatas.voted_by.map(item => item)} }`,
          articleDatas.img_url,
          new Date(articleDatas.created_at)
        ];
      });
      const articles = format(
        "INSERT INTO articles(title, topic, author, body, comments, voted_by, img_url, created_at) VALUES %L;",
        formattedArticleData
      );
      return db.query(articles);
    })
    
    .then(() => {
      const formattedCommentData = commentData.map((commentDatas) => {
        return [
          commentDatas.article_id, commentDatas.article_title,
          commentDatas.body, commentDatas.author,
          `{ ${commentDatas.voted_by.map(item => item)} }`,
          new Date(commentDatas.created_at)
        ];
      });
      const comments = format(
        "INSERT INTO comments(article_id, article_title, body, author, voted_by, created_at) VALUES %L;",
        formattedCommentData
      );
      return db.query(comments);
    });
};

module.exports = seed;
