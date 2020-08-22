import { useState } from 'react';
import axios from 'axios';

/**
 * useForm: A custom hook for forms that takes a callback functin that will be called
 *  when the user submits the form. It returns the form values and the handlers for
 *  changes and submits
 * @param {Function} callback: A function that's called on submit
 * @returns {Function} submitHandler: call on submit
 * @returns {Function} changeHandler: call on changes
 * @returns {Object} values: the form values
 */
export const useForm = (callback) => {
  const [values, setValues] = useState({});

  const submitHandler = (event) => {
    event.preventDefault();
    callback(values);
  };

  const changeHandler = ({ target }) => {
    setValues((previous) => ({ ...previous, [target.name]: target.value }));
  };

  return {
    submitHandler,
    changeHandler,
    values,
  };
};

/**
 * Checks the session on the server to see if there is a logged in user
 */
export const getAuth = () => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: '/auth/session',
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Calls the api to get a user's data
 * @param {Number} userId a user's id number based on page params
 */
export const getUserData = (userId) => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: `/api/users/${userId}`,
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      console.error('ERROR GETTING USER:', err);
      reject(err);
    });
});

/**
 * Calls the DB to get a trail's data
 * @param {Number} trailId a trail's api id
 * @param {Number} userId undefined if not logged in
 */
export const getTrailData = (trailId, userId) => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: `/api/trails/${trailId}`,
    params: {
      id: userId,
    },
  })
    .then((response) => {
      if (Array.isArray(response.data)) {
        resolve(false);
      } else {
        resolve(response.data);
      }
    })
    .catch((err) => {
      reject(err);
    });
});

export const getTrailPlantIdData = (trailId) => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: `/api/plantId/trail/${trailId}`,
    params: {
      id: trailId,
    },
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const getUserPlantIdData = (userId) => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: `/api/plantId/user/${userId}`,
    params: {
      id: userId,
    },
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Update the user's rating must be like or diff returns new rating
 * @param {String} type like or diff which rating to update
 * @param {Number} value new user rating
 * @param {Number} idUser id of the user
 * @param {Number} idTrail id of the trail
 */
export const updateUserRating = (type, value, idUser, idTrail) => new Promise((resolve, reject) => {
  axios({
    method: 'put',
    url: type === 'like' ? '/api/likeability' : '/api/difficulty',
    data: {
      id_user: idUser,
      id_trail: idTrail,
      value,
    },
  })
    .then((response) => {
      resolve(response.data[0]);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Adds a comment to the given photo by the given user
 * @param {String} text comment text
 * @param {Number} idUser id of user submitting comment
 * @param {Number} idPhoto id of photo to attach the comment to
 */
export const addCommentToPhoto = (text, idUser, idPhoto) => new Promise((resolve, reject) => {
  axios({
    method: 'post',
    url: '/api/comments',
    data: {
      text,
      id_user: idUser,
      id_photo: idPhoto,
    },
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Deletes a photo, only call if you already verified the user is authorized
 *  to delete the photo
 * @param {Number} idPhoto id of the photo to delete
 */
export const deletePhoto = (idPhoto) => new Promise((resolve, reject) => {
  axios({
    method: 'delete',
    url: `/api/photos/${idPhoto}`,
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Deletes a comment, only call if you have already verified the user is authorized
 *  to delete the comment
 * @param {Number} commentId id of comment to delete
 */
export const deleteComment = (commentId) => new Promise((resolve, reject) => {
  axios({
    method: 'delete',
    url: `/api/comments/${commentId}`,
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Adds a trail to the db based on an api call
 * @param {Object} trail contains api trail info
 */
export const addTrail = (trail) => new Promise((resolve, reject) => {
  let { description } = trail;
  if (description.length >= 1499) {
    description = description.substring(0, 1499);
  }
  axios({
    method: 'post',
    url: '/api/trails',
    data: {
      ...trail,
      description,
    },
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Updates the favorite table, either removing or adding a favorite based
 *  on the remove parameter
 * @param {Number} id_trail id of trail to effect
 * @param {Number} id_user id of user to effect
 * @param {Boolean} remove true if removing a favorite
 */
export const updateFavorite = (idTrail, idUser, remove) => new Promise((resolve, reject) => {
  axios({
    method: remove ? 'delete' : 'post',
    url: '/api/favorites',
    data: {
      id_trail: idTrail,
      id_user: idUser,
    },
  })
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Checks if the current route is favorited, this could get a specialized database call,
 *  but for now this works
 * @param {Number} idTrail id of the trail to see if it is a favorite
 * @param {Number} idUser id of the user to check
 */
export const getFavoriteStatus = (trailId, userId) => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: `/api/users/${userId}`,
  })
    .then((response) => {
      response.data.favorites.forEach((trail) => {
        if (trail.id === +trailId) {
          resolve(true);
        }
      });
      resolve(false);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Updates a comment's text by its id
 * @param {Number} id the id of the comment to update
 * @param {String} text the text to replace it with
 */
export const updateComment = (id, text) => new Promise((resolve, reject) => {
  axios({
    method: 'put',
    url: '/api/comments',
    data: {
      id,
      text,
    },
  })
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
});

export const uploadPhoto = (data) => new Promise((resolve, reject) => {
  axios({
    method: 'post',
    url: '/api/uploads',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});
