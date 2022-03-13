const express = require("express");
const router = express.Router();
const Players = require('../repos/Players')

router.get("/players", async (req, res) => {

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
 
});

router.post("/players", async (req, res) => {
  const { first_name, last_name, nationality, date_of_birth } = req.body
  const newPlayer = await Players.register(first_name, last_name, nationality, date_of_birth)
  res.send(newPlayer)
});

module.exports = router;