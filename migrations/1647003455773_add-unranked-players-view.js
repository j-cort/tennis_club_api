/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW unranked_players AS (
      SELECT player_id
      FROM winners_and_losers
      GROUP BY player_id
      HAVING COUNT(*) <= 2
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW unranked_players;
  `)
};
