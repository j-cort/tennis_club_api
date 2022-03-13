const express = require("express");
const router = express.Router();
const Matches = require('../repos/Matches')

router.post("/matches", async (req, res) => {
  const { winner_id, loser_id } = req.body
  let winnerPoints = await Matches.getWinnerPoints(winner_id)
  let loserPoints = await Matches.getLoserPoints(loser_id)
  const pointsToTransfer = Math.floor(loserPoints * 0.1)
  winnerPoints += pointsToTransfer
  loserPoints -= pointsToTransfer

  await Matches.updateWinnerPoints(winnerPoints, winner_id)
  await Matches.updateLoserPoints(loserPoints, loser_id)

  const newMatch = await Matches.register(winner_id, loser_id)

  res.send(newMatch)
});

module.exports = router;