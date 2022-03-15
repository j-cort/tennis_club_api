const request = require("supertest");
const app = require("../src/server");

const {
  clearTables,
  closePool,
  matchCount,
  addSamplePlayers,
} = require("./testHelpers");

afterAll(async () => {
  await closePool();
});

describe("#POST:/matches", () => {

  beforeEach(async () => {
    await clearTables();
  });

  test("add new match", async () => {

    await addSamplePlayers()
    const startingMatchCount = await matchCount();
    expect(startingMatchCount).toEqual(0);

    await request(app)
      .post("/matches")
      .send({
        winner_id: 1,
        loser_id: 2,
      })
      .expect(200)
      .then((response) => {
        const { winner_id, loser_id } = response.body[0];
        expect(winner_id).toEqual(1);
        expect(loser_id).toEqual(2);
      });

    const finishMatchCount = await matchCount();
    expect(finishMatchCount).toEqual(1);
  });

});