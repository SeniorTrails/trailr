import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Photo from './Photo.jsx';
import Comment from './Comment.jsx';
import { deletePhoto } from '../helpers';

const StyledImage = styled(Image)`
  width: 100px
`;

/**
 * Carousel is an infinite carousel gallery that displays one large image and the comments
 *  for the selected photo. It needs a function to change the current photo.
 * @param {Array} photos an array of photo information
 * @param {Number} currentPhoto a number representing the location of the current photo
 * @param {Function} changeCurrentPhoto a function that changes the current photo
 * @param {Object} user loggedIn, id, name
 */
const carousel = ({ photos, currentPhoto, changeCurrentPhoto, user }) => {
  const [photo, setPhoto] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments([...photos[currentPhoto].comments]);
    setPhoto({ url: photos[currentPhoto].url });
  }, [currentPhoto, photos]);

  const deleteHandler = (id) => {
    deletePhoto(photos[id].id)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      {!photo.url ? null : <Photo info={photo} />}
      <Carousel
        arrows
        infinite
        slidesPerPage={5}
      >
        {photos.map((item, i) => (
          <div onClick={() => changeCurrentPhoto(i)} key={`image${item.id}`}>
            <StyledImage
              thumbnail
              src={item.url}
              alt="trail"
            />
          </div>
        ))}
      </Carousel>
      <Row>
        {user.loggedIn && user.id === photos[currentPhoto].id_user
          ? <Button variant="danger" onClick={() => deleteHandler(currentPhoto)}>Delete Photo</Button>
          : null}
      </Row>
      {!comments
        ? null
        : comments.map((i) => <Comment key={i.id} info={i} user={user} />)}

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
          id: PropTypes.number,
          text: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  currentPhoto: PropTypes.number.isRequired,
  changeCurrentPhoto: PropTypes.func.isRequired,
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
