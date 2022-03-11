const express = require("express");
const pg = require("pg");
const cors = require("cors");
const playersRouter = require("./routes/players");
const matchesRouter = require("./routes/matches");

module.exports = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(playersRouter)
  app.use(matchesRouter)
  return app;
};












app.listen(3000, () => {
  console.log('Listening on port 3000');
});
