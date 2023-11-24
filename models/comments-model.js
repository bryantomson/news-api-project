const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (article_id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING*`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteFromComments = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
      WHERE comment_id = $1
      RETURNING*;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};


exports.incrementCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments
     SET votes = votes + $2
     WHERE comment_id = $1
     RETURNING*;`,
      [comment_id, inc_votes]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });

}