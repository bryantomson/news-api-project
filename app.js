const { getTopics } = require("./controller");
const {  handleCustomErrors, handle505, handleNotFound } = require("./errors");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);


app.get("*", (req, res, next) => {
  next({ status: 404, msg: "path not found" });
});

app.post("*", (req, res, next) => {
  next({ status: 406, msg: "method not allowed" });
});
app.patch("*", (req, res, next) => {
  next({ status: 406, msg: "method not allowed" });
});
app.delete("*", (req, res, next) => {
  next({ status: 406, msg: "method not allowed" });
});


app.use(handleCustomErrors);
app.use(handleNotFound);
app.use(handle505);

module.exports = app;
