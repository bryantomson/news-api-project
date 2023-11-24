const { selectTopics, checkTopicExists } = require("./models/topics-model");
const {
  selectUsers,
  selectUserByUsername,
} = require("./models/users-model.js");

const {
  selectArticleById,
  selectArticles,
  checkArticleExists,
  incrementArticleVotes,
} = require("./models/articles-model");

const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteFromComments,
} = require("./models/comments-model");

const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  console.log("here");
  const { username } = req.params;
  console.log(username);
  selectUserByUsername(username)
    .then((user) => {
      console.log(user);
      res.status(200).send({user});
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  if (topic) {
    Promise.all([
      selectArticles(topic, sort_by, order),
      checkTopicExists(topic),
    ])
      .then((articles) => {
        const resolvedArticles = articles[0];
        res.status(200).send({ articles: resolvedArticles });
      })
      .catch(next);
  } else {
    selectArticles(topic, sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.getEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json").then((endpoints) => {
    res.status(200).send(endpoints);
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    checkArticleExists(article_id),
  ])
    .then((comments) => {
      const resolvedComments = comments[0];
      res.status(200).send({ comments: resolvedComments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertCommentByArticleId(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  incrementArticleVotes(article_id, inc_votes)
    .then((row) => {
      res.status(200).send({ updated: row });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteFromComments(comment_id)
    .then((response) => {
      res.status(204).send();
    })
    .catch(next);
};
