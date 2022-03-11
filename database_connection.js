const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "tennis_club_test",
  user: "postgres",
  password: "password",
});
