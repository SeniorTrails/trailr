import React from 'react';
import PropTypes from 'prop-types';

/**
 * A single comment with a username
 * @param {String} text text of the comment
 * @param {String} username username that submitted the comment
 */
const comment = ({ text, username }) => (
  <blockquote className="blockquote">
    <p className="mb-0">{text}</p>
    <footer className="blockquote-footer">{username}</footer>
  </blockquote>
);

export default comment;

comment.propTypes = {
  text: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
