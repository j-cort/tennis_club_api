/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    INSERT INTO matches (winner_id, loser_id)
    VALUES 
      (1, 2),
      (1, 3),
      (1, 4),
      (2, 1),
      (2, 3),
      (2, 4),
      (3, 1),
      (3, 1),
      (5, 2);
  `)
};

exports.down = pgm => {
  pgm.sql(`
    TRUNCATE matches RESTART IDENTITY CASCADE;
  `)
};
