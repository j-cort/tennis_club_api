# Tennis Club Backend API

## Requirements

You are the president of the local Tennis Club. Your responsibilities include managing its players and their rankings. You’ve been asked to prepare a backend API in your preferred programming language that consists of the following endpoints:

1. An endpoint for registering a new player into the club
2. An endpoint listing all players in the club
3. An endpoint for registering a match that has been played

## Acceptance Criteria

### *Registering a new player*

- The only required data for registration is the player’s first name and last name, nationality, and the date of birth
- No two players of the same first name and last name can be added
- Players must be at least 16 years old to be able to enter the club
- Each newly registered player should start with the score of 1200 points for the purpose of the ranking

### *Listing all players in the club*

- The list should contain the following information for every player:
  1. the current position in the whole ranking
  2. first and last name
  3. age
  4. nationality
  5. rank name
  6. points
- It should be possible to list only players of particular nationality and/or rank name (see table at the bottom of this section) or all players
- The players should be ordered by points (descending)
- The unranked players should also be ordered by points (descending) but should appear at the bottom of the list, below all other ranks

### *Registering a match*

- It should require providing the winner and the loser of the match
- The loser gives the winner 10% of his points from before the match (rounded down)
  1. For example, if Luca (1000 points) wins a match against Brendan (900 points), Luca should end up with 1090 points after the game and Brendan with 810
  2. If Daniel (700 points) wins a match against James (1200 points), Daniel should end up with 820 points after the game and James with 1080
  3. The business logic behind calculating new player scores after a match should be unit-tested

**The code should be as readable and as well-organized as possible. Add any other information and/or extra validation for the above endpoints as you deem necessary.**

### Rank Points

| Rank              | Points                                    |
| :---------------: | :---------------------------------------: |
| Unranked          | (The player has played less than 3 games) |
| Bronze            | 0 – 2999                                  |
| Silver            | 3000 – 4999                               |
| Gold              | 5000 – 9999                               |
| Supersonic Legend | 10000 – no limit                          |

*****************************************************************

## Planning

- Outlined initial database schemas
- Defined expected endpoint behaviours
- Created preliminary SQL queries (see src\planning\query_planning.sql)
- Experimented with SQL queries using pg-sql.com

![Database Schema](./src\planning\schema_endpoint_planning.PNG)

## Technologies

- PEN Stack (postgres, express, node)

### Server

- Express.js - light-weight, unopinionated web framework
- Cors - middleware that can be used to enable CORS with various options

### Database

- PostgreSQL - open source SQL database
- PGAdmin - Postgres administration & development platform
- node-pg-migrate - database migration management tool

### Testing

- Jest - JavaScript testing framework
- Supertest - React component testing library
- Postman API platform

## Processes

- Queries were simplified by using intermediary view tables
- Incorporated database migrations for more flexible updates
- Express routers (players, matches) are utilised to better separate code, handle validation and conditional logic for endpoints
- Repos for both major endpoints (Players, Matches) do the heavy lifting regarding SQL queries, and abstract generic code out of routers
- jest.config file sets NODE_ENV to test when test files are run, also enabling the database to adjust the database connection accordingly (e.g. choosing tennis_club_test instaead of tennis_club database)
- SRP was respected by extracting the following resources into separate files/folders:
  - database
  - server
  - errorHandling (error object, validation, catching async error middleware)

## Demo

## Running The App


npm run migrate create add extension citext:
********************************************
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

npm run migrate create add table players:
****************************************
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

npm run migrate create add table matches:
****************************************
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

npm run migrate create add view winners and losers:
***************************************************
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

npm run migrate create add view ranked players:
***************************************************
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

npm run migrate create add view unranked players:
**************************************************
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

npm run migrate create add view ranked player details:
*****************************************************
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

npm run migrate create add view unranked player details:
********************************************************
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

npm run migrate create add view joint player details:
*****************************************************
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

npm run migrate create insert sample players:
***************************************************
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

npm run migrate create insert sample matches:
***************************************************
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

DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate up
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate up
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate down 12
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate down 12


## Potential Improvements & Extensions

- Add secondary ordering by last name (in case two players have the same points)
- Add tertiary ordering by first name (in case two players have the same last name)
- Produce custom error message when user attempts to input the same first name/last name combination
- Implement parallel testing
- Randomized the generation of new players and matches for tests, thus making tests more robust
- mocking to better isolate unit tests
- mocking the database to isolate and test the server behaviour
- consider whether unranked players should have a position or not
- add test to ensure positions are allocated accurately
- validate nationalities against fixed list
- validate rank names against fixed list
- place default points into a constant variable