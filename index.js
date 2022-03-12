const express = require("express");
const cors = require("cors");
const pg = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "tennis_club_test",
  user: "postgres",
  password: "password",
})

app.get("/players", async (req, res) => {
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
  console.log(req.body)
  const { winner_id, loser_id } = req.body
  const { rows } = await pool.query(`
  INSERT INTO matches (winner_id, loser_id)
  VALUES ($1, $2) RETURNING *;`, 
  [winner_id, loser_id])
  res.send(rows)
});

app.listen(3005, () => {
  console.log("listening on port 3005");
});
