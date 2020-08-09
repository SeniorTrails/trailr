/* eslint-disable no-shadow */
/* eslint-disable no-console */
const mysql = require('mysql');

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trailr',
};

const connection = mysql.createConnection(mysqlConfig);

const getUser = (idGoogle) => new Promise((resolve, reject) => {
  console.log('GET USER INVOKED');

  const getUserCommand = 'SELECT * FROM users WHERE id_google = ?;';
  const getPhotosCommand = 'SELECT * FROM photos WHERE id_user = ?';

  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(getUserCommand, [idGoogle], (error, userData) => {
      if (error) { // maybe || rows.length > 1 OR separate error to handle more than one result?
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      const user = userData[0];
      const { id } = user;
      connection.query(getPhotosCommand, [id], (error, photoData) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        user.photos = photoData;
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

const getTrail = (idTrail) => new Promise((resolve, reject) => {
  console.log('GET TRAIL INVOKED');

  const getTrailCommand = `SELECT *,
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
    WHERE id = ?`;

  const getPhotosCommand = `SELECT users.*, photos.*
    FROM photos
    LEFT JOIN users ON photos.id_user = users.id
    LEFT JOIN trails ON photos.id_trail = trails.id
    WHERE trails.id = ?`;

  const getCommentsCommand = `SELECT comments.*, users.*
    FROM comments
    LEFT JOIN users ON comments.id_user = users.id
    WHERE id_photo = ?`;

  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(getTrailCommand, [idTrail, idTrail, idTrail], (error, trailData) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      console.log('TRAIL LINE 101: ', trailData);
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
        trail.photos.forEach((photo, i) => {
          const { id } = photo;
          connection.query(getCommentsCommand, [id], (error, commentData) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            trail.photos[i].comments = commentData;
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

const addTrail = (trailObject) => new Promise((resolve, reject) => {
  const trailData = { trailObject };
  const addTrailCommand = '';
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(addTrailCommand, [trailData], (error, rows) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.commit((error) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        resolve(console.log('ADD TRAIL INVOKED', rows));
      });
    });
  });
});

const updateTrail = (trailObject) => new Promise((resolve, reject) => {
  const trailData = { trailObject };
  const updateTrailCommand = '';
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(updateTrailCommand, [trailData], (error, rows) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.commit((error) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        resolve(console.log('UPDATE TRAIL INVOKED', rows));
      });
    });
  });
});

const deleteTrail = (trailObject) => new Promise((resolve, reject) => {
  const trailData = { trailObject };
  const deleteTrailCommand = '';
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(deleteTrailCommand, [trailData], (error, rows) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.commit((error) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        resolve(console.log('DELETE TRAIL INVOKED', rows));
      });
    });
  });
});

module.exports = {
  getUser,
  getTrail,
  addTrail,
  updateTrail,
  deleteTrail,
};

// mysql -uroot < server/index.js
// mysql.server start
