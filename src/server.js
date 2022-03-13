const express = require("express");
const cors = require("cors");

class Server {
  app = null

  static setup() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
  }
}

Server.setup()

module.exports = Server.app;
