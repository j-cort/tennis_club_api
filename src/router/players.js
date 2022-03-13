const express = require("express");
const router = express.Router();
const pool = require('../database')

router.get("/players", async (req, res) => {

  const { rank_name, nationality } = req.body

  if(rank_name && nationality) {
    const { rows } = await pool.query(`
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM joint_player_details
      WHERE rank_name = $1 AND nationality = $2;`,
      [rank_name, nationality]
      )
      res.send(rows) 
  } else if (rank_name) {
    const { rows } = await pool.query(`
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM joint_player_details
      WHERE rank_name = $1;`,
      [rank_name]
    )
    res.send(rows) 
  } else if (nationality) {
    const { rows } = await pool.query(`
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM joint_player_details
      WHERE nationality = $1;`,
      [nationality]
    )
    res.send(rows) 
  } else {
    console.log('hit else')
    const { rows } = await pool.query(`
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM joint_player_details;
  `)
   res.send(rows) 
  }
 
});

router.post("/players", async (req, res) => {
  const { first_name, last_name, nationality, date_of_birth } = req.body
  const { rows } = await pool.query(`
  INSERT INTO players (first_name, last_name, nationality, date_of_birth)
  VALUES ($1, $2, $3, $4) RETURNING *;`, 
  [first_name, last_name, nationality, date_of_birth])
  res.send(rows)
});

module.exports = router;