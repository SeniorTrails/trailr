/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
const mysql = require('mysql');

/**
 *
*/
let poolConnection;
if (!process.env.NODE_ENV) {
  poolConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trailr',
  });
} else if (process.env.NODE_ENV === 'PROD_LOCAL') {
  poolConnection = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: '34.70.176.46',
  });
} else {
  poolConnection = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.DB_INSTANCE_CONNECTION_NAME}`,
  });
}

const getUser = (id) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    const getUserCommand = `
      SELECT *
      FROM users
      WHERE id = ?
    `;
    const getPhotosCommand = `
      SELECT *
      FROM photos
      WHERE id_user = ?
    `;
    const getCommentsCommand = `
      SELECT users.*, comments.*
      FROM comments
      LEFT JOIN users ON comments.id_user = users.id
      WHERE id_photo = ?
    `;

    const getFavoritesCommand = `
      SELECT trails.*
      FROM favorites
      LEFT JOIN trails ON favorites.id_trail = trails.id
      WHERE favorites.id_user = ?
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(getUserCommand, [id], (error, gottenUser) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        if (!gottenUser.length) {
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            resolve(gottenUser);
          });
        } else if (gottenUser.length > 0) {
          const user = gottenUser[0];
          connection.query(getFavoritesCommand, [id], (error, gottenFavorites) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            user.favorites = gottenFavorites;
            connection.query(getPhotosCommand, [id], (error, gottenPhotos) => {
              if (error) {
                connection.rollback(() => {
                  connection.release();
                  return reject(error);
                });
              }
              user.photos = gottenPhotos;
              if (!gottenPhotos.length) {
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
              user.photos.forEach((photo, i) => {
                const { id } = photo;
                connection.query(getCommentsCommand, [id], (error, gottenComments) => {
                  if (error) {
                    connection.rollback(() => {
                      connection.release();
                      return reject(error);
                    });
                  }
                  user.photos[i].comments = gottenComments;
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
        }
      });
    });
  });
});

const addUser = (userObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('ADD USER INVOKED');
    // Probably don't destructure because will error if undefined
    // const { google_id, name, profile_photo_url } = userObject;
    const checkUserCommand = `
      SELECT *
      FROM users
      WHERE google_id = ?
    `;
    const addUserCommand = `
      INSERT INTO users (google_id, name, profile_photo_url)
      VALUES (?, ?, ?)
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(checkUserCommand, [userObject.google_id], (error, userResult) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        if (userResult.length > 0) {
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            resolve({
              message: 'Existing user. Use id listed here with getUser(id) to lookup user or updateUser(id) to update user.',
              id: userResult[0].id,
              name: userResult[0].name,
            });
          });
        } else if (!userResult.length) {
          connection.query(addUserCommand,
            [userObject.google_id, userObject.name, userObject.profile_photo_url],
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
                resolve({ id: addedUser.insertId, name: userObject.name }, console.log('USER ADDED'));
              });
            });
        }
      });
    });
  });
});

const getTrail = (trailObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('GET TRAIL INVOKED');

    const { id_trail, id_user } = trailObject; // TO CHANGE TO OBJ PARAMETERS

    const getTrailCommand = `
      SELECT *,
      (
        SELECT CAST(CAST(ROUND(AVG(value), 1) AS DECIMAL(2,1)) AS CHAR)
        FROM rating_difficulty
        WHERE id_trail = ?
      ) AS averageDifficulty,
      (
        SELECT CAST(CAST(ROUND(AVG(value), 1) AS DECIMAL(2,1)) AS CHAR)
        FROM rating_likeability
        WHERE id_trail = ?
      ) AS averageLikeability,
      (
        SELECT IFNULL((SELECT value
          FROM rating_difficulty
          WHERE id_user = ?
          AND id_trail = ?), 'Rate this trail:')
      ) as userDifficulty,
      (
        SELECT IFNULL((SELECT value
          FROM rating_likeability
          WHERE id_user = ?
          AND id_trail = ?), 'Rate this trail:')
      ) as userLikeability
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
      SELECT users.*, comments.*
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
        [id_trail, id_trail, id_user, id_trail, id_user, id_trail, id_trail],
        (error, gottenTrail) => {
          if (error) {
            connection.rollback(() => {
              connection.release();
              return reject(error);
            });
          }
          if (!gottenTrail.length) {
            connection.commit((error) => {
              if (error) {
                connection.rollback(() => {
                  connection.release();
                  return reject(error);
                });
              }
              resolve(gottenTrail);
            });
          } else if (gottenTrail.length > 0) {
            const trail = gottenTrail[0];
            const { id } = trail;
            connection.query(getPhotosCommand, [id], (error, gottenPhotos) => {
              if (error) {
                connection.rollback(() => {
                  connection.release();
                  return reject(error);
                });
              }
              if (!gottenPhotos.length) {
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
              trail.photos = gottenPhotos;
              trail.photos.forEach((photo, i) => {
                const { id } = photo;
                connection.query(getCommentsCommand, [id], (error, gottenComments) => {
                  if (error) {
                    connection.rollback(() => {
                      connection.release();
                      return reject(error);
                    });
                  }
                  trail.photos[i].comments = gottenComments;
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
          }
        });
    });
  });
});

const addTrail = (trailObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('ADD TRAIL INVOKED');
    // probably don't descructure because will error if undefined
    // const { id, name, city, region, country, latitude,
    // longitude, url, thumbnail, description } = trailObject;

    const checkTrailCommand = `
      SELECT *
      FROM trails
      WHERE api_id = ?
    `;
    const addTrailCommand = `
      INSERT INTO trails (api_id, name, city, region, country, latitude, longitude, url, thumbnail, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(checkTrailCommand, [trailObject.api_id], (error, trailResult) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        if (trailResult.length > 0) {
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return reject(error);
              });
            }
            resolve({
              message: 'Existing trail. Use id listed here with getTrail(id) to lookup trail or updateTrail(id) to update trail.',
              id: trailResult[0].id,
            });
          });
        } else if (!trailResult.length) {
          connection.query(addTrailCommand,
            [trailObject.api_id, trailObject.name, trailObject.city, trailObject.region,
              trailObject.country, trailObject.latitude, trailObject.longitude,
              trailObject.url, trailObject.thumbnail, trailObject.description],
            (error, addedTrail) => {
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
                resolve({ id: addedTrail.insertId }, console.log('TRAIL ADDED'));
              });
            });
        }
      });
    });
  });
});

const updateTrail = (trailObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('UPDATE TRAIL INVOKED');
    const updateTrailCommand = `
      UPDATE trails
      SET
        api_id = ?,
        name = ?,
        city = ?,
        region = ?,
        country = ?,
        latitude = ?,
        longitude = ?,
        url = ?,
        thumbnail = ?,
        description = ?,
        status = ?
      WHERE id = ?
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(updateTrailCommand,
        [trailObject.api_id, trailObject.name, trailObject.city, trailObject.region,
          trailObject.country, trailObject.latitude, trailObject.longitude, trailObject.url,
          trailObject.thumbnail, trailObject.description, trailObject.status, trailObject.id],
        (error, updatedTrail) => {
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
            resolve(updatedTrail, console.log('TRAIL UPDATED'));
          });
        });
    });
  });
});

const deleteTrail = (id) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('DELETE TRAIL INVOKED');
    const deleteTrailCommand = `
      DELETE FROM trails
      WHERE id = ?
    `;
    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(deleteTrailCommand, [id], (error, deletedTrailData) => {
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
          resolve(deletedTrailData, console.log('TRAIL DELETED'));
        });
      });
    });
  });
});

const updateDifficulty = (difficultyObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('UPDATE DIFFICULTY INVOKED');

    const { id_user, id_trail, value } = difficultyObject;

    const checkDifficultyCommand = `
      SELECT *
      FROM rating_difficulty
      WHERE id_user = ? AND id_trail = ?
    `;

    const addDifficultyCommand = `
      INSERT INTO rating_difficulty (id_user, id_trail, value)
      VALUES (?, ?, ?)
    `;

    const updateDifficultyCommand = `
      UPDATE rating_difficulty
      SET value = ?
      WHERE id_user = ? AND id_trail = ?
    `;

    const getAvgDiffCommand = `
        SELECT CAST(CAST(ROUND(AVG(value), 1) AS DECIMAL(2,1)) AS CHAR) AS averageDifficulty
        FROM rating_difficulty
        WHERE id_trail = ?
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(checkDifficultyCommand,
        [id_user, id_trail],
        (error, difficultyResult) => {
          if (error) {
            connection.rollback(() => {
              connection.release();
              return reject(error);
            });
          }
          if (!difficultyResult.length) {
            connection.query(addDifficultyCommand,
              [id_user, id_trail, value], (error, addedDifficulty) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    return reject(error);
                  });
                }
                console.log('DIFFICULTY RATING ADDED: ', addedDifficulty);
              });
          } else if (difficultyResult.length > 0) {
            connection.query(updateDifficultyCommand,
              [value, id_user, id_trail],
              (error, updatedDifficulty) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    return reject(error);
                  });
                }
                console.log('DIFFICULTY RATING UPDATED: ', updatedDifficulty);
              });
          }
          connection.query(getAvgDiffCommand,
            [id_trail],
            (error, newAvgDiff) => {
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
                resolve(newAvgDiff);
              });
            });
        });
    });
  });
});

const updateLikeability = (likeabilityObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('UPDATE LIKEABILITY INVOKED');

    const { id_user, id_trail, value } = likeabilityObject;

    const checkLikeabilityCommand = `
      SELECT *
      FROM rating_likeability
      WHERE id_user = ? AND id_trail = ?
    `;

    const addLikeabilityCommand = `
      INSERT INTO rating_likeability (id_user, id_trail, value)
      VALUES (?, ?, ?)
    `;

    const updateLikeabilityCommand = `
      UPDATE rating_likeability
      SET value = ?
      WHERE id_user = ? AND id_trail = ?
    `;

    const getAvgLikeCommand = `
      SELECT CAST(CAST(ROUND(AVG(value), 1) AS DECIMAL(2,1)) AS CHAR) AS averageLikeability
      FROM rating_likeability
      WHERE id_trail = ?
  `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(checkLikeabilityCommand,
        [id_user, id_trail],
        (error, likeabilityResult) => {
          if (error) {
            connection.rollback(() => {
              connection.release();
              resolve(error);
            });
          }
          let rowsResult;
          console.log('LIKEABILITY RESULT: ', likeabilityResult);
          if (!likeabilityResult.length) {
            connection.query(addLikeabilityCommand,
              [id_user, id_trail, value], (error, addedLikeability) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    resolve(error);
                  });
                }
                rowsResult = addedLikeability ? addedLikeability.affectedRows : 0;
              });
          } else if (likeabilityResult.length > 0) {
            connection.query(updateLikeabilityCommand,
              [value, id_user, id_trail],
              (error, updatedLikeability) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    resolve(error);
                  });
                }
                rowsResult = updatedLikeability ? updatedLikeability.affectedRows : 0;
              });
          }
          connection.query(getAvgLikeCommand,
            [id_trail],
            (error, newAvgLike) => {
              if (error) {
                connection.rollback(() => {
                  connection.release();
                  resolve(error);
                });
              }
              connection.commit((error) => {
                if (error) {
                  connection.rollback(() => {
                    connection.release();
                    resolve(error);
                  });
                }
                const likeabilityReturn = newAvgLike[0] ? newAvgLike : [{}];
                likeabilityReturn[0].affectedRows = rowsResult;
                resolve(likeabilityReturn);
              });
            });
        });
    });
  });
});

const addComment = (commentObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('ADD COMMENT INVOKED');

    const { text, id_user, id_photo } = commentObject;

    const addCommentCommand = `
      INSERT INTO comments (text, id_user, id_photo)
      VALUES (?, ?, ?)
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(addCommentCommand,
        [text, id_user, id_photo],
        (error, addedComment) => {
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
            console.log('COMMENT ADDED');
            resolve({ id: `${addedComment.insertId}` });
          });
        });
    });
  });
});

const addPhoto = (photoObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('ADD PHOTO INVOKED');

    const addPhotoCommand = `
      INSERT INTO photos (url, description, lat, lng, id_user, id_trail)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(addPhotoCommand,
        [photoObject.url, photoObject.description, photoObject.lat,
          photoObject.lng, photoObject.id_user, photoObject.id_trail],
        (error, addedPhoto) => {
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
            console.log('PHOTO ADDED');
            resolve({ id: `${addedPhoto.insertId}` });
          });
        });
    });
  });
});

const deleteComment = (id) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('DELETE COMMENT INVOKED');

    const deleteCommentCommand = `
      DELETE FROM comments
      WHERE id = ?
    `;
    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(deleteCommentCommand, [id], (error, deletedCommentData) => {
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
          resolve(deletedCommentData, console.log('COMMENT DELETED'));
        });
      });
    });
  });
});

const deletePhoto = (id) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('DELETE PHOTO INVOKED');

    const deleteCommentsCommand = `
      DELETE FROM comments
      where id_photo = ?
  `;
    const deletePhotoCommand = `
      DELETE FROM photos
      WHERE id = ?
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(deleteCommentsCommand, [id], (error, deletedCommentData) => {
        if (error) {
          connection.rollback(() => {
            connection.release();
            return reject(error);
          });
        }
        connection.query(deletePhotoCommand, [id], (error, deletedPhotoData) => {
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
            const deletionResults = deletedPhotoData;
            deletionResults.deletedComments = deletedCommentData;
            resolve(deletionResults, console.log('PHOTO DELETED'));
          });
        });
      });
    });
  });
});

const addFavorite = (favoriteObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('ADD FAVORITE INVOKED');

    const { id_user, id_trail } = favoriteObject;

    const addFavoriteCommand = `
      INSERT INTO favorites (id_user, id_trail)
      VALUES (?, ?)
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(addFavoriteCommand,
        [id_user, id_trail],
        (error, addedFavorite) => {
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
            console.log('FAVORITE ADDED');
            resolve({ id: `${addedFavorite.insertId}` });
          });
        });
    });
  });
});

const deleteFavorite = (favoriteObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('DELETE FAVORITE INVOKED');

    const { id_user, id_trail } = favoriteObject;

    const deleteFavoriteCommand = `
      DELETE FROM favorites
      WHERE id_user = ? AND id_trail = ?
    `;
    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(deleteFavoriteCommand,
        [id_user, id_trail],
        (error, deletedFavoriteData) => {
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
            resolve(deletedFavoriteData, console.log('FAVORITE DELETED'));
          });
        });
    });
  });
});

const updateComment = (commentObject) => new Promise((resolve, reject) => {
  poolConnection.getConnection((error, connection) => {
    if (error) reject(error);

    console.log('UPDATE COMMENT INVOKED');
    const updateCommentCommand = `
      UPDATE comments
      SET text = ?
      WHERE id = ?
    `;

    connection.beginTransaction((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          return reject(error);
        });
      }
      connection.query(updateCommentCommand,
        [commentObject.text, commentObject.id],
        (error, updatedComment) => {
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
            resolve(updatedComment, console.log('COMMENT UPDATED'));
          });
        });
    });
  });
});

module.exports = {
  getUser,
  addUser,
  getTrail,
  addTrail,
  updateTrail,
  deleteTrail,
  updateDifficulty,
  updateLikeability,
  addComment,
  addPhoto,
  deleteComment,
  deletePhoto,
  addFavorite,
  deleteFavorite,
  updateComment,
};

// mysql -uroot < server/index.js
// mysql.server start
