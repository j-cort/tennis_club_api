-- Creating & Definining Migrations

-- npm run migrate create add extension citext
exports.up = pgm => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS citext;
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP EXTENSION IF EXISTS citext;
  `)
};

-- npm run migrate create add table players
exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE players (
      id SERIAL PRIMARY KEY,
      first_name CITEXT NOT NULL,
      last_name CITEXT NOT NULL,
      nationality VARCHAR(60) NOT NULL,
      date_of_birth DATE CHECK(AGE(date_of_birth) > '16Y'::INTERVAL) NOT NULL,
      points INTEGER DEFAULT 1200 NOT NULL,
      UNIQUE(first_name, last_name)
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE players;
  `)
};

-- npm run migrate create add table matches
exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE matches (
      id SERIAL PRIMARY KEY,
      winner_id INTEGER REFERENCES players(id) NOT NULL,
      loser_id INTEGER REFERENCES players(id) NOT NULL,
      CHECK(winner_id != loser_id)
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE matches;  
  `)
};

-- npm run migrate create add view winners and losers
exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW winners_and_losers AS (
      SELECT winner_id AS player_id
      FROM matches
      UNION ALL
      SELECT loser_id AS player_id
      FROM matches
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW winners_and_losers;
  `)
};

-- npm run migrate create add view ranked players
exports.up = pgm => {
  pgm.sql(`
  CREATE VIEW ranked_players AS (
    SELECT player_id
    FROM winners_and_losers
    GROUP BY player_id
    HAVING COUNT(*) >= 3
  );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW ranked_players;
  `)
};

-- npm run migrate create add view unranked players
exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW unranked_players AS (
      SELECT id AS player_id
      FROM players
      EXCEPT
      SELECT player_id
      FROM ranked_players
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW unranked_players;
  `)
};

-- npm run migrate create add view ranked player details
exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW ranked_player_details AS (
      SELECT
      id,
      CONCAT(first_name, ' ', last_name) AS name,
      points,
      CASE WHEN points >= 10000 THEN 'Supersonic Legend'
      WHEN points BETWEEN 5000 AND 9999 THEN 'Gold'
      WHEN points BETWEEN 3000 AND 4999 THEN 'Silver'
      ELSE 'Bronze' END
      AS rank_name,
      nationality,
      AGE(date_of_birth) AS age
    FROM players
    WHERE id IN (SELECT player_id FROM ranked_players)
    ORDER BY points DESC
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
  DROP VIEW ranked_player_details;
  `)
};

-- npm run migrate create add view unranked player details
exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW unranked_player_details AS (
      SELECT
      id,
      CONCAT(first_name, ' ', last_name) AS name,
      points,
      'Unranked' AS rank_name,
      nationality,
      AGE(date_of_birth) AS age
      FROM players
      WHERE id IN (SELECT player_id FROM unranked_players)
      ORDER BY points DESC
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW unranked_player_details;
  `)
};

-- npm run migrate create add view joint player details
exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW joint_player_details AS (
      SELECT id, name, points, rank_name, nationality, age
      FROM ranked_player_details
      UNION ALL
      SELECT id, name, points, rank_name, nationality, age
      FROM unranked_player_details
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW joint_player_details;
  `)
};

-- npm run migrate create insert sample players
exports.up = pgm => {
  pgm.sql(`
    INSERT INTO players (first_name, last_name, nationality, date_of_birth)
    VALUES
      ('Peter', 'Smith', 'UK', '10-NOV-1989'),
      ('Roger', 'Gray', 'USA', '16-SEPT-2000'),
      ('Alison', 'Hill', 'Canada', '26-MAY-2002'),
      ('Alice', 'Tully', 'Australia', '01-MAR-1995'),
      ('Serena', 'Snow', 'New Zeland', '31-JAN-1985');
  `)
};

exports.down = pgm => {
  pgm.sql(`
    TRUNCATE players RESTART IDENTITY CASCADE;
  `)
};

-- npm run migrate create insert sample matches
exports.up = pgm => {
  pgm.sql(`
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

exports.down = pgm => {
  pgm.sql(`
    TRUNCATE matches RESTART IDENTITY CASCADE;
  `)
};

-- Initiating Up & Down Migrations
-- DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate up
-- DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate up
-- DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate down 12
-- DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate down 12