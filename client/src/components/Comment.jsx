import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { deleteComment } from '../helpers';

/**
 * A single comment with a username
 * @param {Object} info comment to be displayed
 * @param {Object} user loggedIn, name, id
 */
const comment = ({ info, user }) => {
  const deleteHandler = () => {
    deleteComment(info.id)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const { text, name } = info;
  return (
    <>
      <blockquote className="blockquote">
        <p className="mb-0">{text}</p>
        <footer className="blockquote-footer">{name}</footer>
      </blockquote>
      {user.loggedIn && user.id === info.id_user
        ? (
          <>
            <Button variant="danger" onClick={deleteHandler}>Delete Comment</Button>
            <Button variant="info">Update Comment</Button>
          </>
        )
        : null}
    </>
  );
};

export default comment;

comment.propTypes = {
  info: PropTypes.shape({
    text: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    id_user: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
};
