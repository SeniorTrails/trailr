import React from 'react';
import Comment from './Comment.jsx';

const photo = ({ info: { url, comments } }) => (
  <>
    <img className="img-thumbnail" src={url} />
    {!comments ? null : comments.map((item) => (<Comment text={item.text} username={item.username} />))}
  </>
);

export default photo;
