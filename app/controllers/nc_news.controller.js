const app = require("../api");

const {
  queryUsers,
  queryTopics,
  queryArticles,
  queryArticleById,
  queryCommentsByArticle,
  queryCommentCount,
  insertCommentIntoArticle,
  updateArticleVotes,
  deleteFromComments,
} = require("../models/nc_news.model");

const getUsers = (req, res, next) => {
  return queryUsers()
  .then((users) => {
    return res.status(200).send({ users: users})
  })
}

const getTopics = (req, res, next) => {
  return queryTopics()
    .then((topics) => {
      if (!topics) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  return queryArticles()
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      const promiseArray = [];
      for (let i = 0; i < articles.length; i++) {
        delete articles[i].body;
        promiseArray.push(queryCommentCount(articles[i].article_id));
      }
      Promise.all(promiseArray).then((values) => {
        for (let i = 0; i < values.length; i++) {
          articles[i].comment_count = values[i];
        }
        res.status(200).send({ articles: articles });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return queryArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  return queryCommentsByArticle(article_id)
    .then((comments) => {
      if (!comments || comments.length === 0) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return insertCommentIntoArticle(article_id, username, body).then(
    (comment) => {
      if (!comment) {
        return res.status(404).send({ msg: "404: Not Found" });
      }
      res.status(201).send({ comment: comment });
    }
  )
  .catch((err) => {
    next(err)
  })
};

const updateArticle = (req, res, next) => {
  const { article_id } = req.params
  if (!req.body.hasOwnProperty(inc_votes)) {
    return res.status(400).send({ msg: "400: Bad Request"})
  }
  const votes = req.body.inc_votes
  return updateArticleVotes(article_id, votes)
  .then((article) => {
    if (!article) {
      return res.status(404).send({ msg: "404: Not Found" })
    }
    res.status(200).send({ article: article })
  })
  .catch((err) => {
    next(err)
  })
}

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  return deleteFromComments(comment_id)
  .then(() => {
    return res.status(204).send({ msg: "204: No Content"})
  })
  }



module.exports = {
  getUsers,
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentToArticle,
  updateArticle,
  deleteComment,
};
