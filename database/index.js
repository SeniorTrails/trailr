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
      if (error) {                       // maybe || rows.length > 1 OR separate custom error to handle more than one result
        connection.rollback(() => {
          connection.release();
          return reject(error);
        })
      }
      const user = rows[0];
      const { id } = user;
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
    });
  });

});

const getTrail = (id_trail) => new Promise((resolve, reject) => {
  console.log('GET TRAIL INVOKED')

  const getTrailCommand =
    `SELECT *,
    (
    SELECT SUM(value) / COUNT(id_trail)
    FROM rating_difficulty
    WHERE id_trail = ?
    ) AS difficulty,
    (
    SELECT SUM(value) / COUNT(id_trail)
    FROM rating_likeability
    WHERE id_trail = ?
    ) AS likeability
    FROM trails
    WHERE id = ?`

  const getPhotosCommand =
    `SELECT users.*, photos.* FROM photos
    LEFT JOIN users ON photos.id_user = users.id
    LEFT JOIN trails ON photos.id_trail = trails.id
    WHERE trails.id = ?`

  getCommentsCommand =
    `SELECT comments.*, users.*
    FROM comments
    LEFT JOIN users ON comments.id_user = users.id
    WHERE id_photo = ?`

  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(getTrailCommand, [id_trail, id_trail, id_trail], (error, trailData) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        })
      }
      const trail = trailData[0];
      const { id } = trail;
      connection.query(getPhotosCommand, [id], (error, photoData) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        if (!photoData.length) {
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            resolve(trail);
          });
        }
        trail.photos = photoData;
        trail.photos.map((photo, i) => {
          const { id } = photo;
          connection.query(getCommentsCommand, [id], (error, commentData) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            photo.comments = commentData;
            if (i === trail.photos.length - 1) {
              connection.commit((error) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    return reject(error);
                  });
                }
                resolve(trail);
              });
            }
          });
        });
      });
    });
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

