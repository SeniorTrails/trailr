import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../helpers';
import Input from './input.jsx';

/**
 * Displays an Input textarea and a submit button for adding a comment, upon
 *  submit it runs the appendComments function and updates the database
 * @param {Function} appendComments Function that appends comments to the photo
 */
const addComment = ({ appendComments }) => {
  /**
   * Runs on the form submit and updates database and runs appendComments
   * @param {String} text extracted from a values object
   */
  const commentSubmit = ({ text }) => {
    console.log(text);
    appendComments({ text, id: text[0], username: 'Danny' });
  };

  const { values, changeHandler, submitHandler } = useForm(commentSubmit);

  return (
    <div>
      <Input value={values.text} changeHandler={changeHandler} label="" name="text" type="textarea" />
      <button type="button" className="btn btn-primary" onClick={submitHandler}>Add New Comment</button>
    </div>
  );
};

export default addComment;

addComment.propTypes = {
  appendComments: PropTypes.func.isRequired,
};
