const mysql = require('mysql');

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trailr',
}

const connection = mysql.createConnection(mysqlConfig);

const getUser = (id_google) => new Promise((resolve, reject) => {
  console.log('GET USER INVOKED')


  // const getUserCommand =
  //   `SELECT
  //     *
  //   FROM
  //     users
  //   LEFT JOIN
  //     photos
  //   ON
  //     photos.id_user = (SELECT id FROM users WHERE id_google = ?);`

  const getUserCommand = `SELECT * FROM users WHERE id_google = ?;`
  const getPhotosCommand = `SELECT * FROM photos WHERE id_user = ?`

  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(getUserCommand, [id_google], (error, rows) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        })
      }
      const user = rows[0];
      const { id } = user;
      console.log('USER OBJECT: ', user)
      connection.query(getPhotosCommand, [id], (error, rows) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          })
        }
        user.photos = rows;
        connection.commit((error) => {
          if (error) {
            connection.rollback(() => {
              connection.release();
              return reject(error);
            });
          }
          resolve(user);
        });
      });
      // resolve(rows);
    });
  });

});

const getTrail = (id_trail) => new Promise((resolve, reject) => {
  console.log('GET TRAIL INVOKED')
  const getTrailCommand = `SELECT * FROM trails WHERE id = ?;`
  connection.query(getTrailCommand, [id_trail], (error, rows) => {
    if (error) {
      console.error(error);
      return reject(error);
    }
    // console.log('ROWS FROM TRAIL QUERY: ', rows);
    resolve(rows);
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
// mysql -uroot < server/index.js