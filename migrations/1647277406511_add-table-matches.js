/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE matches (
      id SERIAL PRIMARY KEY,
      winner_id INTEGER REFERENCES players(id) NOT NULL, 
      loser_id INTEGER REFERENCES players(id) NOT NULL,
      CHECK(winner_id != loser_id)
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE matches;  
  `)
};
