const pool = require("../src/database");

const clearTables = async () => {
  await pool.query("TRUNCATE macthes RESTART IDENTITY CASCADE;");
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
      ('Roger', 'Gray', 'USA', '16-SEPT-2000'),
      ('Alison', 'Hill', 'Canada', '26-MAY-2002'),
      ('Alice', 'Tully', 'Australia', '01-MAR-1995'),
      ('Serena', 'Snow', 'New Zeland', '31-JAN-1985');
  `)
};

const addSampleMatches = async () => {
  await pool.query(`
    INSERT INTO matches (winner_id, loser_id)
    VALUES 
      (1, 2),
      (1, 3),
      (1, 4),
      (2, 1),
      (2, 3),
      (2, 4),
      (3, 1),
      (3, 1),
      (5, 2);
  `)
};





module.exports = { clearTables, closePool, addSamplePlayers, addSampleMatches };
