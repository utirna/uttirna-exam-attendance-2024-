const express = require("express");
const { checkForPoolConnection } = require("./middleware");
const connectionController = require("../application/controllers/connectionController");
const connectionRouter = express.Router();

connectionRouter.post(
  "/establish-connection",
  checkForPoolConnection,
  connectionController.establishConnection
);

module.exports = connectionRouter;
