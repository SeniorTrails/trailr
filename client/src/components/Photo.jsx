import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';

/**
 * Displays a photo with Bootstraps thumbnail attribute
 * @param {Object} info contains a url to show
 */
const photo = ({ info: { url } }) => (
  <div>
    <Image thumbnail src={url} alt="trail" />
  </div>
);

export default photo;

photo.propTypes = {
  info: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};
