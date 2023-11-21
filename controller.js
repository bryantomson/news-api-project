const { selectTopics } = require("./models/topics-model");

const { selectArticleById, selectArticles, checkArticleExists } = require("./models/articles-model");
const { selectCommentsByArticleId } = require("./models/comments-model");

const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
      res.status(200).send({ topics });
    });
  };


  exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch((err) => {
      next(err)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
      res.status(200).send({ articles });
    });
  };

  exports.getEndpoints = (req, res, next) => {
    fs.readFile("./endpoints.json").then((endpoints) => {
  res.status(200).send(endpoints)  });
    }

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

exports.getEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json").then((endpoints) => {
    res.status(200).send(endpoints);
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

Promise.all([selectCommentsByArticleId(article_id), checkArticleExists(article_id)]).then((comments) => {
    const resolvedComments = comments[0]
    res.status(200).send({ comments: resolvedComments });
  }).catch(next)
};
