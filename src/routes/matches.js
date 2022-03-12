const express = require("express");
const router = express.Router();

router.get("/matches", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT * FROM matches
  `);
  res.json(rows);
});

module.exports = router;
