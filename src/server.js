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
    this.app.use((err, req, res, next) => {
      const { status = 500, message = "Something Went Wrong" } = err;
      res.status(status).json(message);
    });
  }
}

Server.setup()

module.exports = Server.app;
