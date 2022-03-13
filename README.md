API Tech Test
You are the president of the local Tennis Club. Your responsibilities include managing its players and their rankings. You’ve been asked to prepare a backend API in your preferred programming language that consists of the following endpoints:
1)	An endpoint for registering a new player into the club
a.	The only required data for registration is the player’s first name and last name, nationality, and the date of birth
b.	No two players of the same first name and last name can be added
c.	Players must be at least 16 years old to be able to enter the club
d.	Each newly registered player should start with the score of 1200 points for the purpose of the ranking
2)	An endpoint listing all players in the club
a.	It should be possible to list only players of particular nationality and/or rank name (see the bottom of the document) or all players
b.	The list should contain the following information for every player:
i.	the current position in the whole ranking
ii.	first and last name
iii.	age
iv.	nationality
v.	rank name
vi.	points
c.	The players should be ordered by points (descending)
i.	The unranked players should also be ordered by points (descending) but should appear at the bottom of the list, below all other ranks
3)	An endpoint for registering a match that has been played
a.	It should require providing the winner and the loser of the match
b.	The loser gives the winner 10% of his points from before the match (rounded down)
i.	For example, if Luca (1000 points) wins a match against Brendan (900 points), Luca should end up with 1090 points after the game and Brendan with 810
ii.	If Daniel (700 points) wins a match against James (1200 points), Daniel should end up with 820 points after the game and James with 1080
c.	The business logic behind calculating new player scores after a match should be unit-tested
The code should be as readable and as well-organized as possible. Add any other information and/or extra validation for the above endpoints as you deem necessary.
Rank	Points
Unranked	(The player has played less than 3 games)
Bronze	0 – 2999
Silver	3000 – 4999
Gold	5000 – 9999
Supersonic Legend	10000 – no limit

Tools
    "cors": "^2.8.5",
    "dedent": "^0.7.0",
    "express": "^4.17.3",
    "jest": "^27.5.1",
    "node-pg-migrate": "^6.2.1",
    "nodemon": "^2.0.15",
    "pg": "^8.7.3",
    "pg-format": "^1.0.4",
    "supertest": "^6.2.2"


npm run migrate create add players table
npm run migrate create add matches table
npm run migrate create add winners and losers view
npm run migrate create add ranked players view
npm run migrate create add unranked players view
npm run migrate create add ranked player details view
npm run migrate create add unranked player details view
npm run migrate create add joint player details view
npm run migrate create insert sample players
npm run migrate create insert sample matches
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate up
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate up
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club_test npm run migrate down
DATABASE_URL=postgres://postgres:password@localhost:5432/tennis_club npm run migrate down