const { Pool } = require("pg");

class Database {
  connection = null;
  database = null; 

  static setup() {
    
    if (process.env.NODE_ENV === "prod") {
      this.database = 'tennis_club'
    } else {
      this.database = 'tennis_club_test'
    }

    this.connection = new Pool({
      host: "localhost",
      port: 5432,
      database: this.database,
      user: "postgres",
      password: "password",
    });
  }
}

Database.setup();

module.exports = Database.connection;