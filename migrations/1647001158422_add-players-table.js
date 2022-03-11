/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE players (
      id SERIAL PRIMARY KEY, 
      first_name VARCHAR(60) NOT NULL, 
      last_name VARCHAR(60) NOT NULL, 
      nationality VARCHAR(60) NOT NULL, 
      date_of_birth DATE CHECK(AGE(date_of_birth) > '16Y'::INTERVAL) NOT NULL, 
      points INTEGER DEFAULT 1200 NOT NULL,
      UNIQUE(first_name, last_name)
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE players;
  `)
};
