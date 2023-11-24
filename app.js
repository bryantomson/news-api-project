
const { handleCustomErrors, handle500, handleNotFound } = require("./errors");
const apiRouter = require('./routes/api-router');

const express = require("express");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);


app.get("*", (req, res, next) => {
  next({ status: 404, msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handleNotFound);
app.use(handle500);

module.exports = app;
