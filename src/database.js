const { Pool } = require("pg");

class Database {
  db = null;
  connection = null

  static setup(user = 'postgres', password = 'password') {

    if (process.env.NODE_ENV === "test") {
      this.db = 'tennis_club_test'
    } else {
      this.db = 'tennis_club'
    }

    this.connection = new Pool({
      host: "localhost",
      port: 5432,
      database: this.db,
      user: user,
      password: password,
    });

  }

  static connect() {
    return this.connection
  }

  static close() {
    this.connection.end()
  }
}
Database.setup();
module.exports = Database;