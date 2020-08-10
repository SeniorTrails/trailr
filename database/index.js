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

  const getUserCommand = `
    SELECT *
    FROM users
    WHERE id_google = ?
  `;

  const getPhotosCommand = `
    SELECT *
    FROM photos
    WHERE id_user = ?
  `;

  const getCommentsCommand = `
      SELECT comments.*, users.*
      FROM comments
      LEFT JOIN users ON comments.id_user = users.id
      WHERE id_photo = ?
  `;

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
        user.photos.forEach((photo, i) => {
          const { id } = photo;
          connection.query(getCommentsCommand, [id], (error, commentData) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            user.photos[i].comments = commentData;
            if (i === user.photos.length - 1) {
              connection.commit((error) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    return reject(error);
                  });
                }
                resolve(user);
              });
            }
          });
        });
      });
    });
  });
});

const addUser = (userObject) => new Promise((resolve, reject) => {
  console.log('ADD USER INVOKED');

  const { idGoogle, name, profilePhotoUrl } = userObject;
  const checkUserCommand = `
    SELECT *
    FROM users
    WHERE id_google = ?
  `;
  const addUserCommand = `
    INSERT INTO users (id_google, name, profile_photo_url)
    VALUES (?, ?, ?)
  `;
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(checkUserCommand, [idGoogle], (error, userResult) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      if (userResult.length === 0) {
        connection.query(addUserCommand,
          [idGoogle, name, profilePhotoUrl],
          (error, addedUser) => {
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
              resolve(addedUser, console.log('USER SUCCESSFULLY ADDED'));
            });
          });
      } else if (userResult.length > 0) {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        resolve('User already exists.');
      }
    });
  });
});

const getTrail = (idTrail, idUser) => new Promise((resolve, reject) => {
  console.log('GET TRAIL INVOKED');

  const getTrailCommand = `
    SELECT *,
    (
      SELECT SUM(value) / COUNT(id_trail)
      FROM rating_difficulty
      WHERE id_trail = ?
    ) AS averageDifficulty,
    (
      SELECT SUM(value) / COUNT(id_trail)
      FROM rating_likeability
      WHERE id_trail = ?
    ) AS averageLikeability,
    (
      SELECT value
      FROM rating_difficulty
      WHERE id_user = ?
      AND id_trail = ?
    ) as userDifficultyRating,
    (
      SELECT value
      FROM rating_likeability
      WHERE id_user = ?
      AND id_trail = ?
    ) as userLikeabilityRating
    FROM trails
    WHERE id = ?
  `;

  const getPhotosCommand = `
    SELECT users.*, photos.*
    FROM photos
    LEFT JOIN users ON photos.id_user = users.id
    LEFT JOIN trails ON photos.id_trail = trails.id
    WHERE trails.id = ?
  `;

  const getCommentsCommand = `
    SELECT comments.*, users.*
    FROM comments
    LEFT JOIN users ON comments.id_user = users.id
    WHERE id_photo = ?
  `;

  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(getTrailCommand,
      [idTrail, idTrail, idUser, idTrail, idUser, idTrail, idTrail],
      (error, trailData) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
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
  const { trailId } = trailObject;
  const addTrailCommand = '';
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(addTrailCommand, [trailId], (error, rows) => {
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
  const { trailId } = trailObject;
  const updateTrailCommand = '';
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(updateTrailCommand, [trailId], (error, rows) => {
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
  const { trailId } = trailObject;
  const deleteTrailCommand = '';
  connection.beginTransaction((error) => {
    if (error) {
      connection.rollback(() => {
        connection.release();
        return reject(error);
      });
    }
    connection.query(deleteTrailCommand, [trailId], (error, rows) => {
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

// const updateDifficulty = (trailObject) => new Promise((resolve, reject) => {
//   const { userId, trailId, value } = trailObject;
//   const updateDifficultyCommand = '';
//   connection.beginTransaction((error) => {
//     if (error) {
//       connection.rollback(() => {
//         connection.release();
//         return reject(error);
//       });
//     }
//     connection.query(updateDifficultyCommand, [userId, trailId, value], (error, rows) => {
//       if (error) {
//         connection.rollback(() => {
//           connection.release();
//           return reject(error);
//         });
//       }
//       connection.commit((error) => {
//         if (error) {
//           connection.rollback(() => {
//             connection.release();
//             return reject(error);
//           });
//         }
//         resolve(console.log('UPDATE DIFFICULTY INVOKED', rows));
//       });
//     });
//   });
// });

// const updateLikeability = (trailObject) => new Promise((resolve, reject) => {
//   const { userId, trailId, value } = trailObject;
//   const updateLikeabilityCommand = '';
//   connection.beginTransaction((error) => {
//     if (error) {
//       connection.rollback(() => {
//         connection.release();
//         return reject(error);
//       });
//     }
//     connection.query(updateLikeabilityCommand, [userId, trailId, value], (error, rows) => {
//       if (error) {
//         connection.rollback(() => {
//           connection.release();
//           return reject(error);
//         });
//       }
//       connection.commit((error) => {
//         if (error) {
//           connection.rollback(() => {
//             connection.release();
//             return reject(error);
//           });
//         }
//         resolve(console.log('UPDATE LIKEABILITY INVOKED', rows));
//       });
//     });
//   });
// });

module.exports = {
  getUser,
  addUser,
  getTrail,
  addTrail,
  updateTrail,
  deleteTrail,
  // updateDifficulty,
  // updateLikeability,
};

// mysql -uroot < server/index.js
// mysql.server start
