const {
  getTopics,
  getUsers,
  getEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
} = require("./controller");
const { handleCustomErrors, handle500, handleNotFound } = require("./errors");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);


app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("*", (req, res, next) => {
  next({ status: 404, msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handleNotFound);
app.use(handle500);

module.exports = app;
