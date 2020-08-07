import { useState } from 'react';

/**
 * useForm: A custom hook for forms that takes a callback functin that will be called
 *  when the user submits the form. It returns the form values and the handlers for
 *  changes and submits
 * @param {Function} callback: A function that's called on submit
 * @returns {Function} submitHandler: call on submit
 * @returns {Function} changeHandler: call on changes
 * @returns {Object} values: the form values
 */
const useForm = (callback) => {
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

export default useForm;
