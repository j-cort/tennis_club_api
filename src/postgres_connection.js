const pg = require("pg");

class Pool {
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1 + 1;");
  }

  close() {
    return this._pool.end();
  }

  // SECURITY!!!!!
  query(sql) {
    this._pool.query(sql);
  }
}

module.exports = new Pool();
