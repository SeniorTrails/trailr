import React from 'react';

const photo = ({ info: { url } }) => (
  <div>
    <img className="img-thumbnail" src={url} alt="trail" />
  </div>
);

export default photo;
