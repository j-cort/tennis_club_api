const pool = require('./src/database')
const app = require('./src/server')

app.get("/players", async (req, res) => {

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

app.post("/players", async (req, res) => {
  const { first_name, last_name, nationality, date_of_birth } = req.body
  const { rows } = await pool.query(`
  INSERT INTO players (first_name, last_name, nationality, date_of_birth)
  VALUES ($1, $2, $3, $4) RETURNING *;`, 
  [first_name, last_name, nationality, date_of_birth])
  res.send(rows)
});

app.post("/matches", async (req, res) => {
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

app.listen(3005, () => {
  console.log("listening on port 3005");
});
