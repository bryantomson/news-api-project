exports.handleCustomErrors = (err, req, res, next) => {
  if (
    err.detail ===
    `Key (author)=(${req.body.username}) is not present in table "users".`
  ) {
    res
      .status(404)
      .send({ msg: "username not found, please sign up to continue" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  }

  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
};

exports.handleNotFound = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
