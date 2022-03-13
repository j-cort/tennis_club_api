/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW ranked_player_details AS (
      SELECT 
      id, 
      CONCAT(first_name, ' ', last_name) AS name, 
      points,
      CASE WHEN points >= 10000 THEN 'Supersonic Legend'
      WHEN points BETWEEN 5000 AND 9999 THEN 'Gold'
      WHEN points BETWEEN 3000 AND 4999 THEN 'Silver'
      ELSE 'Bronze' END
      AS rank_name,
      nationality,
      AGE(date_of_birth) AS age
    FROM players
    WHERE id IN (SELECT player_id FROM ranked_players)
    ORDER BY points DESC
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
  DROP VIEW ranked_player_details;
  `)
};
