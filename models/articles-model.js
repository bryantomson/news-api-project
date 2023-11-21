const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Article does not exist" });
    });
};

