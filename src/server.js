const express = require("express");
const cors = require("cors");
const playerRoutes = require('./router/players')
const matchRoutes = require('.//router/matches')

class Server {
  app = null

  static setup() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(playerRoutes);
    this.app.use(matchRoutes);
  }
}

Server.setup()

module.exports = Server.app;
