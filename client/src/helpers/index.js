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
      console.log(response.data);
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * Calls the api to get a trail's data
 * @param {Number} trailId a trail's id number based on the page params
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
      console.log(response.data);
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
      console.log(response.data);
      resolve(response.data);
    })
    .catch((err) => {
      reject(err);
    });
});
