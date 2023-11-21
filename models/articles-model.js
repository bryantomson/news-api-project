const db = require("../db/connection");

exports.selectArticles = () => {
  console.log("in model");
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS "comment_count" 
      FROM articles  LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};


exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id = $1;`,
      [article_id]
    )
    .then(({rows}) => {
      if (rows.length) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Article does not exist" });
    });
};
