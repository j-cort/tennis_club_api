const Database = require("../database");
const pool = Database.connect()

class Players {

  static async register(first_name, last_name, nationality, date_of_birth) {
    const { rows } = await pool.query(`
      INSERT INTO players (first_name, last_name, nationality, date_of_birth)
      VALUES ($1, $2, $3, $4) RETURNING *;`, 
      [first_name, last_name, nationality, date_of_birth]
    )
    return rows
  }

  static async findByRankAndNationality(rank_name, nationality) {
    const { rows } = await pool.query(`
    (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM ranked_player_details
      WHERE rank_name = $1 AND nationality = $2
      ORDER BY points DESC
      )
      UNION ALL
      (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM unranked_player_details
      WHERE rank_name = $1 AND nationality = $2
      ORDER BY points DESC
      );`,
      [rank_name, nationality]
      )
      return rows
  }

  static async findByRank(rank_name) {
    const { rows } = await pool.query(`
    (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM ranked_player_details
      WHERE rank_name = $1
      ORDER BY points DESC
      )
      UNION ALL
      (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM unranked_player_details
      WHERE rank_name = $1
      ORDER BY points DESC
      );`,
      [rank_name]
      )
      return rows
  }

  static async findByNationality(nationality) {
    const { rows } = await pool.query(`
    (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM ranked_player_details
      WHERE nationality = $1
      ORDER BY points DESC
      )
      UNION ALL
      (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM unranked_player_details
      WHERE nationality = $1
      ORDER BY points DESC
      );`,
      [nationality]
      )
      return rows
  }

  static async find() {
    const { rows } = await pool.query(`
    (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM ranked_player_details
      ORDER BY points DESC
      )
      UNION ALL
      (
      SELECT 
      id, 
      name, 
      RANK () OVER (ORDER BY points DESC) AS position,
      rank_name,
      points, 
      nationality, 
      age
      FROM unranked_player_details
      ORDER BY points DESC
      );
      `)
    return rows
  }
  
}

module.exports = Players;
