const mysql = require('mysql');

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trailr',
}

const connection = mysql.createConnection(mysqlConfig);

const getUser = () => new Promise((resolve, reject) => {
  resolve(console.log('GET USER INVOKED'));
});

const getTrail = (id_trail) => new Promise((resolve, reject) => {
  console.log('GET TRAIL INVOKED')
  // resolve(console.log('GET TRAIL INVOKED'));
  const getTrailCommand = `SELECT * FROM trails WHERE id = ?;`
  connection.query(getTrailCommand, [id_trail], (error, rows) => {
    if (error) {
      console.error(error);
      return reject(error);
    }
    console.log('GOT TRAIL: ', rows)
    const trail = {
      name: 'TRAIL NAME GOES HERE'
    };
    resolve(trail);
  });
});

const addTrail = () => new Promise((resolve, reject) => {
  resolve(console.log('ADD TRAIL INVOKED'));
});

const updateTrail = () => new Promise((resolve, reject) => {
  resolve(console.log('UPDATE TRAIL INVOKED'));
});

const deleteTrail = () => new Promise((resolve, reject) => {
  resolve(console.log('DELETE TRAIL INVOKED'));
});


module.exports = {
  getUser,
  getTrail,
  addTrail,
  updateTrail,
  deleteTrail,
};

// mysql.server start