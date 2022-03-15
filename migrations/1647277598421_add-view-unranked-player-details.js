/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW unranked_player_details AS (
      SELECT 
      id, 
      CONCAT(first_name, ' ', last_name) AS name, 
      points, 
      'Unranked' AS rank_name,
      nationality,
      AGE(date_of_birth) AS age
      FROM players
      WHERE id IN (SELECT player_id FROM unranked_players) 
      ORDER BY points DESC
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW unranked_player_details;
  `)
};
