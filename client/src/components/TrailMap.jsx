import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker.jsx';

/**
 * Displays the Map for a given trail with markers showing all of the photo locations
 * @param {Object} location {lat, lng} of current trail
 * @param {Array} photoInfo Array of photos to display
 * @param {Function} changeCurrentPhoto function that changes photo to given id
 * @param {Number} currentPhoto number that represents id of current photo
 */
const Map = ({
  location,
  photoInfo,
  changeCurrentPhoto,
  currentPhoto,
}) => (
  <GoogleMapReact
    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
    defaultCenter={{ lat: 0, lng: 0 }}
    center={location}
    defaultZoom={15}
  >
    <Marker lat={location.lat} lng={location.lng} clickHandler={() => {}} />
    {photoInfo.map((item, i) => (
      <Marker
        color={i === currentPhoto ? 'green' : 'blue'}
        clickHandler={() => changeCurrentPhoto(i)}
        key={item.id}
        lat={item.lat}
        lng={item.lng}
      />
    ))}
  </GoogleMapReact>
);

export default Map;

Map.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  photoInfo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
  ).isRequired,
  changeCurrentPhoto: PropTypes.func.isRequired,
  currentPhoto: PropTypes.number.isRequired,
};
