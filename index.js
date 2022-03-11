const express = require("express");
const pg = require("pg");
const cors = require("cors");

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "tennis_club_test",
  user: "postgres",
  password: "password",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// IMPORT ROUTES
// const playerRoutes = require("./routes/players");
// const matchRoutes = require("./routes/matches");

app.get("/", async (req, res) => {
  res.send('yeet')
})

app.get("/players", async (req, res) => {
  const { rows } = await pool.query(`
      SELECT * FROM players;
    `)
    console.log(rows)
    res.json(rows)
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// pool.query("SELECT 1 + 1;").then((res) => console.log(res));