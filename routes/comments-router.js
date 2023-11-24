const commentsRouter = require("express").Router();

const { deleteCommentById } = require("../controller");

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;
