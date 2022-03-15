/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    INSERT INTO players (first_name, last_name, nationality, date_of_birth)
    VALUES 
      ('Peter', 'Smith', 'UK', '10-NOV-1989'),
      ('Roger', 'Gray', 'USA', '16-SEPT-2000'),
      ('Alison', 'Hill', 'Canada', '26-MAY-2002'),
      ('Alice', 'Tully', 'Australia', '01-MAR-1995'),
      ('Serena', 'Snow', 'New Zeland', '31-JAN-1985');
  `)
};

exports.down = pgm => {
  pgm.sql(`
    TRUNCATE players RESTART IDENTITY CASCADE;
  `)
};
