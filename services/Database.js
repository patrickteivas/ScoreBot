const sqlite3 = require('sqlite3').verbose();

module.exports = class Database {
  constructor() {
    this.initConnection();
    this.initTable();
  }

  initConnection() {
    this.db = new sqlite3.Database(':memory:', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        throw new Error(err);
      }
      
      console.log('Database connected');
    })
  }

  initTable() {
    this.db.prepare('CREATE TABLE IF NOT EXISTS scores (name TEXT UNIQUE PRIMARY KEY, score NUMBER)').run().finalize((err) => {
      if (err) {
        throw new Error(err);
      }

      console.log('scores table created');
    });
  }

  getScoreByName(name, callback) {
    this.db.get(`SELECT * FROM scores WHERE name=?`, name, (err, row) => {
      if (err) {
        throw new Error(err)
      }
      
      console.log(`Get ${name} score`)
      callback(row);
    });
  }
  
  insertByName(name, score, callback) {
    this.db.run('INSERT INTO scores (name, score) VALUES(?, ?)', [name, score], (err) => {
      if (err) {
        throw new Error(err);
      }
      
      console.log(`Insert ${name} with ${score} score`)
      callback(name, score);
    })
  }
  
  updateByName(name, score, callback) {
    this.db.run('UPDATE scores SET score=? WHERE name=?', [score, name], (result, err) => {
      if (err) {
        throw new Error(err);
      }
      
      console.log(`Update ${name} with ${score} score`)
      callback(name, score);
    })
  }
}