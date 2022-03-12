const express = require("express");
const cors = require("cors");
const playersRouter = require("./routes/players");
const matchesRouter = require("./routes/matches");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(playersRouter)
app.use(matchesRouter)

module.exports = app;