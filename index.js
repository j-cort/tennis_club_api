const pool = require("./src/postgres_connection");
const app = require("./src/express_server");

pool
  .connect({
    host: "localhost",
    port: 5432,
    database: "tennis_club_test",
    user: "postgres",
    password: "password",
  })
  .then(() => {
    app.listen(3005, () => {
      console.log("listening on port 3005");
    });
  })
  .catch((err) => console.error(err));
