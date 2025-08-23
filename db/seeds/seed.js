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
        password VARCHAR(50),
        verified BOOLEAN DEFAULT false,
        description VARCHAR(200),
        theme VARCHAR(6) DEFAULT 'light',
        profile_colour VARCHAR(200), 
        avatar_img_url VARCHAR(200),
        banner_img_url VARCHAR(200),
        banner_blend VARCHAR(30) DEFAULT 'normal',
        banner_position VARCHAR(30) DEFAULT 'center',
        articles VARCHAR[] DEFAULT '{}' NOT NULL,
        comments VARCHAR[] DEFAULT '{}' NOT NULL,
        subscribed_topics VARCHAR[] DEFAULT '{}' NOT NULL,
        subscribed_games VARCHAR[] DEFAULT '{}' NOT NULL,
        followers VARCHAR[] DEFAULT '{}' NOT NULL,
        following VARCHAR[] DEFAULT '{}' NOT NULL,
        voted_articles INT[] DEFAULT '{}' NOT NULL,
        voted_comments VARCHAR[] DEFAULT '{}' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE topics(
        type VARCHAR(10) DEFAULT 'topic',
        slug VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50),
        created_by VARCHAR(50) REFERENCES users(username), 
        description VARCHAR(300), 
        subscribers VARCHAR[] DEFAULT '{}' NOT NULL,
        articles VARCHAR[] DEFAULT '{}' NOT NULL,
        comments VARCHAR[] DEFAULT '{}' NOT NULL,
        topic_colour VARCHAR(20),
        img_url VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY,
        type VARCHAR(10) DEFAULT 'article',
        title VARCHAR(200), 
        topic VARCHAR(50) REFERENCES topics(slug),
        author VARCHAR(50) REFERENCES users(username), 
        body TEXT, 
        voted_by VARCHAR[] DEFAULT '{}' NOT NULL,
        comments VARCHAR[] DEFAULT '{}' NOT NULL, 
        img_url VARCHAR(300),
        link_url VARCHAR(300),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        type VARCHAR(10) DEFAULT 'comment',
        article_id INT,
        article_title VARCHAR,
        author VARCHAR REFERENCES users(username),
        body TEXT, 
        voted_by VARCHAR[] DEFAULT '{}' NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        );`
      );
    })
    .then(() => {
      const formattedUserData = userData.map((userDatas) => {
        return [
          userDatas.username, userDatas.name, userDatas.email,
          userDatas.description, userDatas.password, userDatas.verified, userDatas.theme,
          userDatas.profile_colour, userDatas.avatar_img_url, userDatas.banner_img_url,
          `{ ${userDatas.articles.map(item => item)} }`,
          `{ ${userDatas.comments.map(item => item)} }`,
          `{ ${userDatas.subscribed_topics.map(item => item)} }`,
          `{ ${userDatas.subscribed_games.map(item => item)} }`,
          `{ ${userDatas.followers.map(item => item)} }`,
          `{ ${userDatas.following.map(item => item)} }`,
          `{ ${userDatas.voted_articles.map(item => item)} }`,
          `{ ${userDatas.voted_comments.map(item => item)} }`,
          new Date(userDatas.created_at)];
      });
      const users = format(
        "INSERT INTO users(username, name, email, description, password, verified, theme, "+
        "profile_colour, avatar_img_url, banner_img_url, "+
        "articles, comments, subscribed_topics, subscribed_games, followers, following, "+
        "voted_articles, voted_comments, created_at) VALUES %L;",
        formattedUserData
      );
      return db.query(users);
    })
    .then(() => {
      const formattedTopicData = topicData.map((topicDatas) => {
        return [
          topicDatas.slug, topicDatas.name,
          topicDatas.created_by, topicDatas.description, 
          `{ ${topicDatas.subscribers.map(item => item)} }`,
          `{ ${topicDatas.articles.map(item => item)} }`,
          `{ ${topicDatas.comments.map(item => item)} }`,
          topicDatas.topic_colour,
          topicDatas.img_url, 
          new Date(topicDatas.created_at)];
      });
      const topics = format(
        "INSERT INTO topics(slug, name, created_by, description, subscribers, articles, comments, topic_colour, img_url, created_at) VALUES %L;",
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
          articleDatas.link_url,
          articleDatas.img_url,
          new Date(articleDatas.created_at)
        ];
      });
      const articles = format(
        "INSERT INTO articles(title, topic, author, body, comments, voted_by, link_url, img_url, created_at) VALUES %L;",
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
