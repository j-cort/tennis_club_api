const express = require("express");
const router = express.Router();
const Players = require('../repos/Players')
const AppError = require("../errorHandling/AppError");
const handleAsyncErrors = require('../errorHandling/handleAsyncErrors')


router.get("/players", handleAsyncErrors(async (req, res) => {
    const { rank_name, nationality } = req.body
    let players;
    if(rank_name && nationality) {
      players = await Players.findByRankAndNationality(rank_name, nationality);
    } else if (rank_name) {
      players = await Players.findByRank(rank_name);
    } else if (nationality) {
      players = await Players.findByNationality(nationality);
    } else {
      players = await Players.find();
    };
    res.send(players)
}));

router.post("/players", handleAsyncErrors(async (req, res) => {
  // return next(new AppError('invalid input', 400))
    const { first_name, last_name, nationality, date_of_birth } = req.body
    const newPlayer = await Players.register(first_name, last_name, nationality, date_of_birth)
    res.send(newPlayer)
}));

router.get("/allplayers", handleAsyncErrors(async (req, res) => {
  const allPlayers = await Players.findAll();
  res.send(allPlayers);
}))
module.exports = router;