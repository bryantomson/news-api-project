const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
exports.selectUserByUsername = (username) => {
  console.log("model", username);
  return db
    .query(`SELECT * FROM users WHERE name = $1;`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};
