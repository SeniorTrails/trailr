import React, { useState, useEffect } from 'react';
import Photo from './Photo.jsx';
import Comment from './Comment.jsx';

const carousel = ({ photos }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [photo, setPhoto] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments([...photos[currentPhoto].comments]);
    setPhoto({ url: photos[currentPhoto].url });
  }, [currentPhoto]);

  const changeCurrentPhoto = (id) => {
    setCurrentPhoto(id);
  };

  return (
    <div>
      <Photo info={photo} />
      <div style={{ display: 'flex', flexWrap: 'wrap', }}>
        {photos.map((item, i) => (
          <div onClick={() => changeCurrentPhoto(i)} key={item.id}>
            <img
              className="img-thumbnail m-3"
              src={item.url}
              alt="trail"
              style={{ width: '100px' }}
            />
          </div>
        ))}
      </div>
      {!comments
        ? null
        : comments.map((i) => <Comment key={i.id} text={i.text} username={i.username} />)}
    </div>
  );
};

export default carousel;
