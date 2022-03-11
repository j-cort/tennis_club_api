const express = require("express");
const router = express.Router();

router.get("/players", async (req, res) => {
  // const { name, email, username, password, location } = req.body.user;
  const { rows } = await.pool.query(`
      SELECT * FROM players;
    `)
});

// router.post("/users", async (req, res) => {
//   const { name, email, username, password, location } = req.body.user;
//   const user = new User({ name, email, username });
//   await User.register(user, password);
//   const newUserPacket = {
//     success: true, 
//     username, 
//     location
//   }
//   res.json(newUserPacket);
// });