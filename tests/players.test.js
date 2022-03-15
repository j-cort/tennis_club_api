const request = require("supertest");
const app = require("../src/server");
const {
  clearTables,
  closePool,
  playerCount,
  addSamplePlayers,
  addSampleMatches,
  addThreeIdenticalMatches,
  setPlayerPoints,
} = require("./testHelpers");

afterAll(async () => {
  await closePool();
});

describe("#POST:/players", () => {
  beforeEach(async () => {
    await clearTables();
  });

  test("add new player with default 1200 points", async () => {
    const startingPlayerCount = await playerCount();
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

    const finishPlayerCount = await playerCount();
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

  test("players are ranked according to points and matches played: Unranked(under 3 matches played), Bronze(0-2999), Silver(3000–4999). Gold(5000–9999), Supersonic Legend(10000+)", async () => {
    await request(app)
    .get("/players")
    .expect(200)
    .then((response) => {
     const playerSix = response.body.filter(player => player.id === 6)[0]
     expect(playerSix.rank_name === 'Unranked')
    });
    
    await addThreeIdenticalMatches(6, 10)
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
       const playerSix = response.body.filter(player => player.id === 6)[0]
       expect(playerSix.rank_name === 'Bronze')
      });

    await setPlayerPoints(3000, 6)
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
       const playerSix = response.body.filter(player => player.id === 6)[0]
       expect(playerSix.rank_name === 'Silver')
      });

      await setPlayerPoints(5000, 6)
      await request(app)
        .get("/players")
        .expect(200)
        .then((response) => {
         const playerSix = response.body.filter(player => player.id === 6)[0]
         expect(playerSix.rank_name === 'Gold')
        });

      await setPlayerPoints(10000, 6)
      await request(app)
        .get("/players")
        .expect(200)
        .then((response) => {
         const playerSix = response.body.filter(player => player.id === 6)[0]
         expect(playerSix.rank_name === 'Supersonic Legend')
        });


  });

  test("can filter players by nationality", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        expect(response.body.every(player => player.nationality === 'UK')).toBe(false)
      });

    await request(app)
      .get("/players")
      .send({nationality: 'UK'})
      .expect(200)
      .then((response) => {
        expect(response.body.every(player => player.nationality === 'UK')).toBe(true)
      });
  });

  test("can filter players by rank_name", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        expect(response.body.every(player => player.rank_name === 'Unranked')).toBe(false)
      });

    await request(app)
      .get("/players")
      .send({rank_name: 'Unranked'})
      .expect(200)
      .then((response) => {
        expect(response.body.every(player => player.rank_name === 'Unranked')).toBe(true)
      });
  });

  test("can filter players by nationality & rank_name", async () => {
    await request(app)
      .get("/players")
      .expect(200)
      .then((response) => {
        expect(response.body.every(player => player.rank_name === 'Unranked' && player.nationality === 'UK')).toBe(false)
      });

    await request(app)
      .get("/players")
      .send({rank_name: 'Unranked', nationality: 'UK'})
      .expect(200)
      .then((response) => {
        expect(response.body.every(player => player.rank_name === 'Unranked' && player.nationality === 'UK')).toBe(true)
      });
  });

});
