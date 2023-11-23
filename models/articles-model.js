const db = require("../db/connection");

exports.selectArticles = (topic) => {
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS "comment_count" 
FROM articles  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) queryString += ` WHERE topic = $1`;

  queryString += ` GROUP BY articles.article_id 
ORDER BY articles.created_at DESC;`;

  if (topic) {
    return db.query(queryString, [topic]).then(({ rows }) => {
      return rows;
    });
  }

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS "comment_count" FROM articles  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Article does not exist" });
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.incrementArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING*;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};
