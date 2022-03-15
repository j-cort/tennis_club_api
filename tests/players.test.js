const request = require("supertest");
// const { randomBytes } = require('crypto');
// const { default: migrate } = require('node-pg-migrate');
// const format = require('pg-format');
// require('dotenv').config()

const app = require("../src/server");
const {
  clearTables,
  closePool,
  addSamplePlayers,
  addSampleMatches,
} = require("./testHelpers");
const Players = require("../src/repos/Players");
const { now } = require("moment");

// beforeAll(async () => {
//   // Randomly generate role name to connect to pg with
//   const roleName = 'a' + randomBytes(4).toString('hex');

//   // Create a new role
//   await pool.query(`
//     CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}';
//   `);
//   // Create a new schema
//   await pool.query(`
//     CREATE SCHEMA ${roleName} AUTHORIZATION ${roleName};
//   `)
//   // Disconnect entirely from pg
//   await pool.end();
//   // run our migrations in the new schema
//   await migrate({
//     schema: roleName,
//     direction: 'up',
//     log: () => {},
//     noLock: true,
//     dir: 'migrations',
//     databaseUrl: {
//       host: 'localhost',
//       port: 5432,
//       database: 'tennis_club_test',
//       user: roleName,
//       password: roleName
//     }
//   })
//   // connect to PG as the newly created role
//   process.env.PGUSER = roleName;
//   process.env.PGPASSWORD = roleName;

//   pool = require('../src/database')
// });

afterAll(async () => {
  await closePool();
});

describe("#POST:/players", () => {
  beforeEach(async () => {
    await clearTables();
  });

  test("add new player with default 1200 points", async () => {
    const startingPlayerCount = await Players.count();
    expect(startingPlayerCount).toEqual(0);

    await request(app)
      .post("/players")
      .send({
        first_name: "Michelle",
        last_name: "Gray",
        nationality: "UK",
        date_of_birth: "15-06-2000",
      })
      .expect(200)
      .then((response) => {
        const { first_name, last_name, points } = response.body[0];
        expect(first_name).toEqual("Michelle");
        expect(last_name).toEqual("Gray");
        expect(points).toEqual(1200);
      });

    const finishPlayerCount = await Players.count();
    expect(finishPlayerCount).toEqual(1);
  });

  test("throw error on missing first name", async () => {
    await request(app)
      .post("/players")
      .send({
        last_name: "Gray",
        nationality: "UK",
        date_of_birth: "15-06-2000",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual("first name required");
      });
  });

  test("throw error on missing last name", async () => {
    await request(app)
      .post("/players")
      .send({
        first_name: "Michelle",
        nationality: "UK",
        date_of_birth: "15-06-2000",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual("last name required");
      });
  });

  test("throw error on missing nationality", async () => {
    await request(app)
      .post("/players")
      .send({
        first_name: "Michelle",
        last_name: "Gray",
        date_of_birth: "15-06-2000",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual("nationality required");
      });
  });

  test("throw error on missing date of birth", async () => {
    await request(app)
      .post("/players")
      .send({
        first_name: "Michelle",
        last_name: "Gray",
        nationality: "UK",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual("date of birth required");
      });
  });

  test("throw error on player under 16", async () => {
    const fifteenYears = 1 * 1000 * 60 * 60 * 24 * 365 * 15;
    const dob = new Date(Date.now() - fifteenYears).toISOString();
    await request(app)
      .post("/players")
      .send({
        first_name: "Michelle",
        last_name: "Gray",
        nationality: "UK",
        date_of_birth: dob,
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual("must be over 16");
      });
  });

  test("throw error on duplicate name entries (case insensitive)", async () => {
    await request(app)
      .post("/players")
      .send({
        first_name: "michelle",
        last_name: "gray",
        nationality: "UK",
        date_of_birth: "15-06-2000",
      })
      .expect(200);

    await request(app)
      .post("/players")
      .send({
        first_name: "michelle",
        last_name: "gray",
        nationality: "UK",
        date_of_birth: "15-06-2000",
      })
      .expect(500)
      .then((response) => {
        expect(response.body).toEqual(
          'duplicate key value violates unique constraint "players_first_name_last_name_key"'
        );
      });
  });
});

describe("#GET:/players", () => {
  beforeAll(async () => {
    await clearTables();
    await addSamplePlayers();
    await addSampleMatches();
  });

  test("returns id, name, position, rank_name, points, nationality, age of all registered players", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        expect(
          response.body.every(
            (player) =>
              player.id &&
              player.name &&
              player.position &&
              player.rank_name &&
              player.points &&
              player.nationality &&
              player.age
          )
        ).toBe(true);
      });
  });

  test("player with ids 10, 9, 5, 2 are ranked 'Bronze', player with ids 8, 7, 6, 3, 1 are 'Unranked'", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        const playedThreeOrMore = [10, 9, 5, 2]
        const playedTwoOrLess = [8, 7, 6, 3, 1]
        let rankedPlayers = response.body.filter(player => playedThreeOrMore.includes(player.id))
        let unrankedPlayers = response.body.filter(player => playedTwoOrLess.includes(player.id))
        expect(rankedPlayers.every(player => player.rank_name === 'Bronze'))
        expect(unrankedPlayers.every(player => player.rank_name === 'Unranked'))
      });
  });

  test("unranked players are listed last", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        expect(response.body[0].rank_name).toBe('Bronze')
        expect(response.body[1].rank_name).toBe('Bronze')
        expect(response.body[2].rank_name).toBe('Bronze')
        expect(response.body[3].rank_name).toBe('Bronze')
        expect(response.body[4].rank_name).toBe('Unranked')
        expect(response.body[5].rank_name).toBe('Unranked')
        expect(response.body[6].rank_name).toBe('Unranked')
        expect(response.body[7].rank_name).toBe('Unranked')
        expect(response.body[8].rank_name).toBe('Unranked')
        expect(response.body[9].rank_name).toBe('Unranked')
      });
  });

  test("ranked players are listed in order of points (descending), then unranked players are listed in order of points (descending)", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        expect(response.body[0].points >= response.body[1].points).toBe(true)
        expect(response.body[1].points >= response.body[2].points).toBe(true)
        expect(response.body[2].points >= response.body[3].points).toBe(true)

        expect(response.body[4].points >= response.body[5].points).toBe(true)
        expect(response.body[5].points >= response.body[6].points).toBe(true)
        expect(response.body[6].points >= response.body[7].points).toBe(true)
        expect(response.body[7].points >= response.body[8].points).toBe(true)
        expect(response.body[8].points >= response.body[9].points).toBe(true)
      });
  });

  // test all columns are present
  // test unranked players are at the bottom
  // test position according to points

  // test only certain rank is present
  // test only certain nationaluty is present
  // test only certain rank and nationality is present
});
