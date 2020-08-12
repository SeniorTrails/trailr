import React from 'react';
import redMarker from '../../assets/imgs/redMarker.png';
import greenMarker from '../../assets/imgs/greenMarker.png';
import blueMarker from '../../assets/imgs/blueMarker.png';

/** Marker Component for Google Map, don't worry about the $hover
 *   it is automatically handled. Only needs a lat, lng, and a clickHandler
 * @param {Function} clickHandler function that runs on click
 * @param {String} color of marker defaults to red
 * @param {Number} size number for size defaults to 40
 */
const marker = ({clickHandler, color, size = 43, $hover }) => {
  let icon;
  switch (color){
    case 'green': icon = greenMarker; break;
    case 'blue': icon = blueMarker; break;
    case 'red': default: icon = redMarker;
  }

  const style = {
    height: `${size}px`,
    position: 'absolute',
    transform: 'translate(-51%, -100%)',
  };

  const hoverStyle = {
    height: `${size * 1.2}px`,
    position: 'absolute',
    transform: 'translate(-51%, -101%)',
    cursor: 'pointer',
    zIndex: '100000',
  };

  return (
    <div onClick={clickHandler}>
      <img style={!$hover ? style : hoverStyle} src={icon} alt="Marker" />
    </div>
  );
};

export default marker;
