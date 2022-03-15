const express = require("express");
const router = express.Router();
const moment = require('moment')
const Players = require('../repos/Players')
const AppError = require("../errorHandling/AppError");
const handleAsyncErrors = require('../errorHandling/handleAsyncErrors')
const { validatePlayerInput } = require('../errorHandling/validations')


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
    res.json(players)
}));

router.post("/players", handleAsyncErrors(async (req, res) => {
    const { first_name, last_name, nationality, date_of_birth } = req.body
    validatePlayerInput(first_name, last_name, nationality, date_of_birth)
    const newPlayer = await Players.register(first_name, last_name, nationality, date_of_birth)
    res.json(newPlayer)
}));

module.exports = router;