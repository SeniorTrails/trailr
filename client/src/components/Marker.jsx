import React from 'react';
import redMarker from '../../assets/imgs/redMarker.png';
import greenMarker from '../../assets/imgs/greenMarker.png';
import blueMarker from '../../assets/imgs/blueMarker.png';

const marker = ({clickHandler, color, size = 40, $hover }) => {
  let icon;
  switch (color){
    case 'green': icon = greenMarker; break;
    case 'blue': icon = blueMarker; break;
    case 'red': default: icon = redMarker;
  }

  const style = {
    height: `${size}px`,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  };

  const hoverStyle = {
    height: `${size * 1.2}px`,
    position: 'absolute',
    transform: 'translate(-50%, -60%)',
    cursor: 'pointer',
  };

  return (
    <div onClick={clickHandler}>
      <img style={!$hover ? style : hoverStyle} src={icon} alt="Marker" />
    </div>
  );
};

export default marker;
