const request = require("supertest");
const app = require("../src/server");

const {
  clearTables,
  closePool,
  addSamplePlayers,
  getPoints,
} = require("./testHelpers");

afterAll(async () => {
  await closePool();
});

describe("#Scoring", () => {
  beforeEach(async () => {
    await clearTables();
  });

  test("the winner takes 10% of loser's points", async () => {
    let defaultPoints = 1200
    await addSamplePlayers();
    const playerOneStartingPoints = await getPoints(1);
    const playerTwoStartingPoints = await getPoints(2);
    expect(playerOneStartingPoints).toBe(defaultPoints);
    expect(playerTwoStartingPoints).toBe(defaultPoints);

    await request(app)
      .post('/matches')
      .send({winner_id: 1, loser_id: 2})
    await request(app)
      .post('/matches')
      .send({winner_id: 1, loser_id: 2})
    await request(app)
      .post('/matches')
      .send({winner_id: 1, loser_id: 2})

    const playerOneFinishingPoints = await getPoints(1);
    const playerTwoFinishingPoints = await getPoints(2);

    let playerOneCalculatedPoints = defaultPoints;
    let playerTwoCalculatedPoints = defaultPoints;
    for (let i = 0; i < 3; i++) {
      let pointsToTransfer = Math.floor(playerTwoCalculatedPoints * 0.1);
      playerOneCalculatedPoints += pointsToTransfer;
      playerTwoCalculatedPoints -= pointsToTransfer;
    }
    expect(playerOneFinishingPoints).toBe(playerOneCalculatedPoints);
    expect(playerTwoFinishingPoints).toBe(playerTwoCalculatedPoints);
  });
});
