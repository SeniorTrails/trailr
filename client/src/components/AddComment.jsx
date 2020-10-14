import React from 'react';
import PropTypes from 'prop-types';
import { useForm, addCommentToPhoto } from '../helpers';
import Input from './input.jsx';

/**
 * Displays an Input textarea and a submit button for adding a comment, upon
 *  submit it runs the appendComments function and updates the database
 * @param {Function} appendComments Function that appends comments to the photo
 * @param {Number} userId current logged in user
 * @param {Number} photoId current photo to add a comment to
 * @param {String} username current logged in user's name
 */
const addComment = ({
  appendComments, userId, photoId, name,
}) => {
  /**
   * Runs on the form submit and updates database and runs appendComments
   * @param {String} text extracted from a values object
   */
  const commentSubmit = ({ text }) => {
    addCommentToPhoto(text, userId, photoId)
      .then(({ id }) => {
        appendComments({
          text, id: +id, name, id_user: userId,
        });

        // eslint-disable-next-line no-use-before-define
        values.text = '';
      })
      .catch((err) => {
        console.error(err);
      });
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
  userId: PropTypes.number.isRequired,
  photoId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};
