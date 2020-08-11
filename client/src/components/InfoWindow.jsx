import React from 'react';
import { Link } from 'react-router-dom';

const InfoWindow = ({ props, onCloseClick }) => {
  const { selectedTrail } = props;
  const place = selectedTrail;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 6px 1px rgba(0, 0, 0, 0.5)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 12, position: 'relative', left: '96%' }} onClick={onCloseClick}>x</div>
      <Link to={`/trail/${place.id}`} activeclassname="active">
        <h2>{place.name}</h2>
      </Link>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: 'grey' }}>{place.rating} </span>
        <span style={{ color: 'orange' }}>
          {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
        </span>
        <span style={{ color: 'lightgrey' }}>
          {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>{place.length} miles</div>
      <div style={{ fontSize: 14, color: 'green' }}>{place.description}</div>
    </div>
  );
};

export default InfoWindow;
