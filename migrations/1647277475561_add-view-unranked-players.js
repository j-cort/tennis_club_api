/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW unranked_players AS (
      SELECT id AS player_id
      FROM players
      EXCEPT
      SELECT player_id
      FROM ranked_players
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW unranked_players;
  `)
};
