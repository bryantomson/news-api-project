const { selectTopics } = require("./models/topics-model");
const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
exports.getEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json").then((endpoints) => {
res.status(200).send(endpoints)  });
};
