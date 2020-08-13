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
      reject(err);
    });
});
