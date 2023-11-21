const { selectTopics } = require("./models/topics-model");

const { selectArticleById } = require("./models/articles-model");

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

exports.getEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json").then((endpoints) => {
res.status(200).send(endpoints)  });

};
