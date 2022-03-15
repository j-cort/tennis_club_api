const Database = require("../src/database");
const pool = Database.connect()

const clearTables = async () => {
  await pool.query("TRUNCATE matches RESTART IDENTITY CASCADE;");
  await pool.query("TRUNCATE players RESTART IDENTITY CASCADE;");
};

const closePool = async () => {
  await pool.end();
};

const addSamplePlayers = async () => {
  await pool.query(`
    INSERT INTO players (first_name, last_name, nationality, date_of_birth)
    VALUES 
      ('Peter', 'Smith', 'UK', '10-NOV-1989'),
      ('Roger', 'Gray', 'Mexico', '16-SEPT-2000'),
      ('Alison', 'Hill', 'Cuba', '26-MAY-2002'),
      ('Brianne', 'Tarth', 'Spain', '01-MAR-1995'),
      ('Serena', 'Snow', 'Finland', '31-JAN-1985'),
      ('Rafael', 'Johnson', 'Jamaica', '31-JAN-1985'),
      ('Maria', 'Jones', 'USA', '31-JAN-1985'),
      ('Tim', 'Morrison', 'UK', '31-JAN-1985'),
      ('Paolo', 'Morales', 'Brazil', '31-JAN-1985'),
      ('June', 'Birde', 'UK', '31-JAN-1985');
  `)
};

const addSampleMatches = async () => {
  await pool.query(`
    INSERT INTO matches (winner_id, loser_id)
    VALUES 
      (10, 9),
      (10, 9),
      (10, 9),
      (5, 10),
      (5, 9),
      (3, 5),
      (3, 2),
      (2, 10),
      (2, 1);
  `)
};

module.exports = { clearTables, closePool, addSamplePlayers, addSampleMatches };
