import React from 'react';

const comment = ({text, username}) => (
  <blockquote className="blockquote pb-5">
    <p className="mb-0">{text}</p>
    <footer className="blockquote-footer">{username}</footer>
  </blockquote>
);

export default comment;
