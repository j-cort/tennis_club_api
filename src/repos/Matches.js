const Database = require("../database");
const pool = Database.connect()

class Matches {

  static async getWinnerPoints(winner_id) {
    const { rows } = await pool.query(`
      SELECT points
      FROM players
      WHERE id = $1`,
      [winner_id]
    )
      return rows[0]['points']
  }

  static async getLoserPoints(loser_id) {
    const { rows } = await pool.query(`
      SELECT points
      FROM players
      WHERE id = $1`,
      [loser_id]
    )
      return rows[0]['points']
  }

  static async updateWinnerPoints(winnerPoints, winner_id) {
    const { rows } = await pool.query(`
      UPDATE players
      SET points = $1
      WHERE id = $2
      RETURNING points`,
      [winnerPoints, winner_id]
    )
    return rows
  }

  static async updateLoserPoints(loserPoints, loser_id) {
    const { rows } = await pool.query(`
      UPDATE players
      SET points = $1
      WHERE id = $2
      RETURNING points`,
      [loserPoints, loser_id]
    )
    return rows
  }
 
  static async register(winner_id, loser_id) {
    const { rows } = await pool.query(`
      INSERT INTO matches (winner_id, loser_id)
      VALUES ($1, $2) RETURNING *;`, 
      [winner_id, loser_id]
    )
    return rows
  }
}

module.exports = Matches;
