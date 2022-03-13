const request = require("supertest");
const pool = require("../databaseConnection");
const app = require("../app");
const { clearTables, closePool, addSamplePlayers, addSampleMatches } = require("./testHelpers");

beforeEach(async () => {
  await clearTables();
});

afterAll(async() => {
  await closePool();
});

describe("POST/players", async () => {
  // test("creates a player", async () => {
  //   await request(app())
  //     .post('/players')
  //     .send({ 
  //       first_name: 'Joe',
  //       last_name: 'Waller',
  //       nationality: 'UK',
  //       date_of_birth: '15-06-2000'
  //     })
  //     .expect(200);
  // });
});
