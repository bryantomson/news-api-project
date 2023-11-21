const { getTopics, getEndpoints, getArticles } = require("./controller");
const {  handleCustomErrors, handle500, handleNotFound } = require("./errors");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api", getEndpoints)


app.get("*", (req, res, next) => {
  next({ status: 404, msg: "path not found" });
});


app.use(handleCustomErrors);
app.use(handleNotFound);
app.use(handle500);

module.exports = app;
