/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE VIEW winners_and_losers AS (
      SELECT winner_id AS player_id
      FROM matches
      UNION ALL
      SELECT loser_id AS player_id
      FROM matches
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP VIEW winners_and_losers;
  `)
};
