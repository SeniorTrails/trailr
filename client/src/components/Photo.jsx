import React from 'react';
import Comment from './Comment.jsx';

const photo = ({ info: { url, comments } }) => (
  <>
    <img className="img-thumbnail" src={url} alt="trail" />
    {!comments
      ? null
      : comments.map((item) => <Comment key={item.id} text={item.text} username={item.username} />)}
  </>
);

export default photo;
