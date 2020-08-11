import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Photo from './Photo.jsx';
import Comment from './Comment.jsx';

/**
 * Carousel is an infinite carousel gallery that displays one large image and the comments
 *  for the selected photo. It needs a function to change the current photo.
 * @param {Array} photos an array of photo information
 * @param {Number} currentPhoto a number representing the location of the current photo
 * @param {Function} changeCurrentPhoto a function that changes the current photo
 */
const carousel = ({ photos, currentPhoto, changeCurrentPhoto }) => {
  const [photo, setPhoto] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments([...photos[currentPhoto].comments]);
    setPhoto({ url: photos[currentPhoto].url });
  }, [currentPhoto, photos]);

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

carousel.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          text: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
        }),
      ),
    }),
  ).isRequired,
  currentPhoto: PropTypes.number.isRequired,
  changeCurrentPhoto: PropTypes.func.isRequired,
};
