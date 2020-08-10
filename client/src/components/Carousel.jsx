import React, { useState, useEffect } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Photo from './Photo.jsx';
import Comment from './Comment.jsx';

const carousel = ({ photos, currentPhoto, changeCurrentPhoto }) => {
  const [photo, setPhoto] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments([...photos[currentPhoto].comments]);
    setPhoto({ url: photos[currentPhoto].url });
  }, [currentPhoto]);


  return (
    <div>
      <Photo info={photo} />
      <Carousel
        arrows
        infinite
        slidesPerPage={5}
      >
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
      </Carousel>
      {!comments
        ? null
        : comments.map((i) => <Comment key={i.id} text={i.text} username={i.username} />)}
    </div>
  );
};

export default carousel;
