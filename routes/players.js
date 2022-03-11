const express = require("express");
const router = express.Router();

router.get("/players", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT 
    id, 
    name, 
    RANK () OVER (ORDER BY points DESC) AS position,
    rank_name,
    points, 
    nationality, 
    age
    FROM joint_player_details;
  `);
  res.json(rows);
});

module.exports = router;
