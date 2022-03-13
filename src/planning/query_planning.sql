-- Create Table: players
CREATE TABLE players (
  id SERIAL PRIMARY KEY, 
  first_name VARCHAR(60) NOT NULL, 
  last_name VARCHAR(60) NOT NULL, 
  nationality VARCHAR(60) NOT NULL, 
  date_of_birth DATE CHECK(AGE(date_of_birth) > '16Y'::INTERVAL) NOT NULL, 
  points INTEGER DEFAULT 1200 NOT NULL,
  UNIQUE(first_name, last_name)
);

-- Create Table: matches
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  winner_id INTEGER REFERENCES players(id) NOT NULL, 
  loser_id INTEGER REFERENCES players(id) NOT NULL,
  CHECK(winner_id != loser_id)
);

-- Create View: winners_and_losers
CREATE VIEW winners_and_losers AS (
  SELECT winner_id AS player_id
  FROM matches
  UNION ALL
  SELECT loser_id AS player_id
  FROM matches
);

-- CREATE View: ranked_players
CREATE VIEW ranked_players AS (
  SELECT player_id
  FROM winners_and_losers
  GROUP BY player_id
  HAVING COUNT(*) >= 3
);

-- Create View: unranked_players
CREATE VIEW unranked_players AS (
  SELECT player_id
  FROM winners_and_losers
  GROUP BY player_id
  HAVING COUNT(*) <= 2
);

-- Create View: ranked_player_details
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
  WHERE id IN (SELECT * FROM ranked_players)
  ORDER BY points DESC
);

-- Create View: unranked_player_details
CREATE VIEW unranked_player_details AS (
  SELECT 
  id, 
  CONCAT(first_name, ' ', last_name) AS name, 
  points, 
  'Unranked' AS rank_name,
  nationality,
  AGE(date_of_birth) AS age
  FROM players
  WHERE id IN (SELECT * FROM unranked_players) 
  ORDER BY points DESC
);

-- Create View: joint_player_details
CREATE VIEW joint_player_details AS (
  SELECT * FROM ranked_player_details
  UNION ALL
  SELECT * FROM unranked_player_details
);

-- Insert Players
INSERT INTO players (first_name, last_name, nationality, date_of_birth)
VALUES 
	('Peter', 'Smith', 'UK', '10-NOV-1989'),
  ('Roger', 'Gray', 'USA', '16-SEPT-2000'),
  ('Alison', 'Hill', 'Canada', '26-MAY-2002'),
  ('Alice', 'Tully', 'Australia', '01-MAR-1995'),
  ('Serena', 'Snow', 'New Zeland', '31-JAN-1985');
  
  
-- Insert Matches
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

-- SELECT All Players Query
SELECT 
	id, 
  name, 
  RANK () OVER (ORDER BY points DESC) AS position,
  rank_name,
  points, 
  nationality, 
  age
FROM joint_player_details;

-- SELECT Players By Nationality Query
SELECT 
	id, 
  name, 
  RANK () OVER (ORDER BY points DESC) AS position,
  rank_name,
  points, 
  nationality, 
  age
FROM joint_player_details
WHERE nationality = 'UK';

-- SELECT Players By Rank
SELECT 
	id, 
  name, 
  RANK () OVER (ORDER BY points DESC) AS position,
  rank_name,
  points, 
  nationality, 
  age
FROM joint_player_details
WHERE rank = 'Bronze';

-- SELECT Players By Nationality & Rank
SELECT 
	id, 
  name, 
  RANK () OVER (ORDER BY points DESC) AS position,
  rank_name,
  points, 
  nationality, 
  age
FROM joint_player_details
WHERE nationality = 'USA' AND rank = 'Silver';
  
-- Update Player Points
UPDATE players
SET points = 1320
WHERE loser_id = 1
