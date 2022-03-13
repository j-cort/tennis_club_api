/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW joint_player_details AS (
      SELECT id, name, points, rank_name, nationality, age
      FROM ranked_player_details
      UNION ALL
      SELECT id, name, points, rank_name, nationality, age 
      FROM unranked_player_details
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW joint_player_details;
  `)
};
