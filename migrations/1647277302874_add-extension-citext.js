/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS citext;
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP EXTENSION IF EXISTS citext;
  `)
};
