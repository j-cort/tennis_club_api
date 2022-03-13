const express = require("express");
const router = express.Router();
const pool = require('../database')

router.post("/matches", async (req, res) => {
  const { winner_id, loser_id } = req.body

  const winnerPointsRow = await pool.query(`
    SELECT points
    FROM players
    WHERE id = $1`,
    [winner_id]
    )
  
  const loserPointsRow = await pool.query(`
    SELECT points
    FROM players
    WHERE id = $1`,
    [loser_id]
    )
  let winnerPoints = winnerPointsRow['rows'][0]['points']
  let loserPoints = loserPointsRow['rows'][0]['points']
  const pointsToTransfer = Math.floor(loserPoints * 0.1)

  winnerPoints += pointsToTransfer
  loserPoints -= pointsToTransfer

  const newWinnerPoints = await pool.query(`
    UPDATE players
    SET points = $1
    WHERE id = $2
    RETURNING points`,
    [winnerPoints, winner_id]
  )

  const newLoserPoints = await pool.query(`
    UPDATE players
    SET points = $1
    WHERE id = $2
    RETURNING points`,
    [loserPoints, loser_id]
  )

  const { rows } = await pool.query(`
    INSERT INTO matches (winner_id, loser_id)
    VALUES ($1, $2) RETURNING *;`, 
    [winner_id, loser_id]
  )

  res.send(rows)
});

module.exports = router;