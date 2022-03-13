const request = require("supertest");
// const { randomBytes } = require('crypto');
// const { default: migrate } = require('node-pg-migrate');
// const format = require('pg-format');
// require('dotenv').config()

const app = require('../src/server')
// let pool = require('../src/database')
const { clearTables, closePool } = require("./testHelpers");
const Players = require('../src/repos/Players')

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


beforeEach(async () => {
  await clearTables();
});


afterAll(async() => {
  await closePool();
});

describe('POST:/players', () => {

  test("add new player with default 1200 points", async () => {
    const startingPlayerCount = await Players.count();
    expect(startingPlayerCount).toEqual(0)
    await request(app)
      .post('/players')
      .send({ 
        first_name: 'Michelle',
        last_name: 'Gray',
        nationality: 'UK',
        date_of_birth: '15-06-2000'
      })
      .expect(200)
      .then(response => {
        const { first_name, last_name, points } = response.body[0]
        expect(first_name).toEqual('Michelle')
        expect(last_name).toEqual('Gray')
        expect(points).toEqual(1200)
      })

    const finishPlayerCount = await Players.count();
    expect(finishPlayerCount).toEqual(1)
  });

  test("throw error on missing firstname", async () => {
    await request(app)
      .post('/players')
      .send({ 
        last_name: 'Gray',
        nationality: 'UK',
        date_of_birth: '15-06-2000'
      })
      .expect(200)  
  });



})





// const User = require("../model/user");
// const { resetDatabase, endPool } = require("./testHelpers");
// const persistedData = require("../persistedData");

// beforeEach(async () => {
//   await resetDatabase();
// });

// afterAll(async () => {
//   await endPool();
// });

// test("adds a new user to the db", async () => {
//   const userID = await User.create(
//     "jamesywamesy",
//     "jamesywamesy@jmail.com",
//     "jameson"
//   );

//   const userInfo = await persistedData("users", userID);
//   const { id, username, email, password } = userInfo

//   expect(id).toBe(userID);
//   expect(username).toBe("jamesywamesy");
//   expect(email).toBe("jamesywamesy@jmail.com");
//   expect(await User.checkPW("jameson", password)).toBe(true);
//   expect(await User.checkPW("wameson", password)).toBe(false);

// });

// test("does not create a user with duplicate credentials", async () => {
  
//   const newUser = await User.create('jamesywamesy', 'jamesywamesy@jmail.com', 'jameson');
//   expect(newUser).toBeTruthy;

//   const sameUsername = await User.create("jamesywamesy", "bamesywamesy@jmail.com", "jameson")
//   expect(sameUsername).toBeFalsy();

//   const sameEmail = await User.create("bamesywamesy", "jamesywamesy@jmail.com", "jameson")
//   expect(sameEmail).toBeFalsy();

//   const uniqueCredentials = await User.create("bamesywamesy", "bamesywamesy@jmail.com", "jameson")
//   expect(uniqueCredentials).toBeTruthy();

// });