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
- Created and incrementally refined database migrations (see src\planning\migration_planning.sql)
![Database Schema](./src/planning/schema_endpoint_planning.PNG)

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
- jest.config file sets NODE_ENV to test when test files are run, also enabling the database to adjust the database connection accordingly (e.g. choosing tennis_club_test instead of tennis_club database)
- SRP was respected by extracting the following resources into separate files/folders:
  - database
  - server
  - errorHandling (error object, validation, catching async error middleware)

## Demo

### GET /players

- List All Players
![All Players](./src/planning/postman/postman_select_all_players.PNG)
- List Bronze Players
![Bronze Players](./src/planning/postman/postman_select_players_bronze.PNG)
- List UK Players
![UK Players](./src/planning/postman/postman_select_players_uk.PNG)
- List Bronze UK Players
![Bronze UK Players](./src/planning/postman/postman_select_players_bronze_uk.PNG)

### POST /players

- Register Player OK

![Register Player](./src/planning/postman/postman_register_player.PNG)

- Register Player Missing Firstname

![Register Players No Firstname](./src/planning/postman/postman_register_player_missing_firstname.PNG)

- Register Player Missing Lastname

![Register Players No Lastname](./src/planning/postman/postman_register_player_missing_lastname.PNG)

- Register Player Missing Nationality

![Register Players No Nationality](./src/planning/postman/postman_register_player_missing_nationality.PNG)

- Register Player Missing D.O.B

![Register Players No DOB](./src/planning/postman/postman_register_player_missing_dob.PNG)

- Register Player Under 16

![Register Players Under 16](./src/planning/postman/postman_register_player_underage.PNG)

### POST /macthes

- Register Match OK

![Register Match](./src/planning/postman/postman_register_match.PNG)

- Register Match Missing/Invalid Ids

![Register Match Invaild Inputs](./src/planning/postman/postman_register_match_invalid_missing_ids.PNG)

## Running The App

1. Install Postgres & pgAdmin

- MAC OS: [postgres app](https://postgresapp.com/), [pgAdmin](pgadmin.org/download)
- Windows: [postgres installer](postgresql.org/download/windows)

*on pgAdmin for mac, click 'create server' > set host as 'localhost' and set username as 'postgres' (if you want to use the mac's username instead, please change the db connection configuration in src/database.js from user: 'postgres' to user:<mac's username>*
*during windows installation wizard, uncheck 'stack builder', otherwise continue with default setup options*

2. Create Databases In pgAdmin

- Right click databases in pgAdmin > create > Enter 'tennis_club' > save
- Right click databases in pgAdmin > create > Enter 'tennis_club_test' > save

3. Get This Repo

- Clone repo

```
git clone https://github.com/j-cort/tennis_club_api.git
```

- Move into the app's directory and run npm i to download dependencies

```
cd tennis_club_api/
npm i
```

4. Run Database Migrations

Type the following in your terminal:

Windows
```
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate up
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate up
```

MAC OS
```
DATABASE_URL=postgres://<USERNAME>@localhost:5432/tennis_club npm run migrate up
DATABASE_URL=postgres://<USERNAME>@localhost:5432/tennis_club_test npm run migrate up
```
*your username is likely your mac's username or 'postgres' depending on how you set up postgres*

5. Run tests

```
npm run test
```

6. Interact with API

- Start server

```
nodemon index.js
```

- Download Postman
https://www.postman.com/product/rest-client/
- Send Requests Through Postman App (for example):

API Requests 1       |     API Requests 2       |     API Requests 3
:-------------------------:|:-------------------------:|:-------------------------:
<img src="./src/planning/postman/postman_documentation_01.PNG" alt="api1" width="350">  |  <img src="./src/planning/postman/postman_documentation_02.PNG" alt="api2" width="350">  |  <img src="./src/planning/postman/postman_documentation_03.PNG" alt="api3" width="350"> 

See demo section for more in depth examples.

## Potential Improvements & Extensions

- Add secondary ordering by last name (in case two players have the same points)
- Add tertiary ordering by first name (in case two players have the same last name)
- Produce custom error message when input violates no duplicate first/last name combination constraint during player registration
- Produce custom error message when input is invalid or incomplete during match registration
- Implement parallel testing
- Randomise the generation of new players and matches for tests - making tests more robust
- mocking to better isolate unit tests
- mocking the database to isolate and test the server behaviour
- consider whether unranked players should have a position or not
- add test to ensure positions are allocated accurately
- validate nationalities against fixed list
- validate rank names against fixed list
- place default points into a constant variable for repeated use
- 1647277639996_add-view-joint-player-details migration is no longer used, consider removing
