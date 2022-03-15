const Database = require("../src/database");
const pool = Database.connect()

const clearTables = async () => {
  await pool.query("TRUNCATE matches RESTART IDENTITY CASCADE;");
  await pool.query("TRUNCATE players RESTART IDENTITY CASCADE;");
};

const closePool = async () => {
  await pool.end();
};

const playerCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) FROM players;
  `)
  return Number(rows[0]['count']);
}

const matchCount = async () => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) FROM matches;
  `)
  return Number(rows[0]['count']);
}

const getPoints = async (playerId) => {
  const { rows } = await pool.query(`
    SELECT points
    FROM players
    WHERE id = $1;`, 
    [playerId]
  )
  return Number(rows[0]['points'])
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
}

const addThreeIdenticalMatches = async (winner_id, loser_id) => {
  await pool.query(`
    INSERT INTO matches (winner_id, loser_id)
    VALUES 
      ($1, $2),
      ($1, $2),
      ($1, $2);`,
      [winner_id, loser_id])
}

const setPlayerPoints = async (points, playerId) => {
  await pool.query(`
  UPDATE players
    SET points = $1
    WHERE id = $2;`, 
    [points, playerId]
  )

};





module.exports = { clearTables, closePool, playerCount, matchCount, getPoints, addSamplePlayers, addSampleMatches, addThreeIdenticalMatches, setPlayerPoints}
