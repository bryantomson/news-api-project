const { selectTopics } = require("./models/topics-model");
const { selectArticleById } = require("./models/articles-model");

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
};
