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

app.listen(3005, () => {
  console.log("listening on port 3005");
});
